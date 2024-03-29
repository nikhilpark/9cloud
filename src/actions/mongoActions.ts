"use server"
import { getSession } from '@auth0/nextjs-auth0';
import dbPromise from "@/helpers/connectMongo"
import { getUidFromSub } from '@/helpers/helpers';

export async function getUserProfile() {
  const db = await dbPromise()

  let session = await getSession();
  if (!session) return JSON.stringify('')
  const user = session.user
  const uid = getUidFromSub(user.sub)

  const mongoUser = await db.connection.collection("users").findOne({ uid: uid })

  if (mongoUser && mongoUser.plan) {
    const plan = await db.connection.collection("plans").findOne({ _id: mongoUser.plan });
    mongoUser.planData = plan;
    return JSON.stringify(mongoUser)
  } else {
    const freePlan = await db.connection.collection("plans").findOne({ planName: "free" })

    await db.connection.collection("users").updateOne({ uid: uid }, { $set: { plan: freePlan._id } })

  }
  const freePlan = await db.connection.collection("plans").findOne({ planName: "free" })

  const newUser = {
    email: user.email,
    uid: uid,
    picture: user.picture,
    plan: freePlan._id,
    name: user.name,
    sub: user.sub
  }
  newUser.planData = freePlan.planData
  await db.connection.collection("users").insertOne(newUser)
  return JSON.stringify(newUser)

}
export async function getUserId() {
  try {

    const db = await dbPromise()
    let session = await getSession();
    if (!session) return JSON.stringify('')
    const user = session.user
    const uid = getUidFromSub(user.sub)
    const mongoUser = await db.connection.collection("users").findOne({ uid: uid })
    if (mongoUser) return mongoUser.uid
    return ''
  } catch (err) {
    console.log(err)
    return ''
  }
}

export async function updateFileAccessTime(uid: string, key: string) {
  const db = await dbPromise()

  const userDoc = await db.connection.collection("users").findOne({ uid: uid })
  if (!userDoc.recentFiles) {
    // If 'recentFiles' key doesn't exist, create it with a new entry
    userDoc.recentFiles = [{ key, time: new Date() }];
  } else {
    // Check if the key already exists in the recentFiles array
    //@ts-ignore
    const existingIndex = userDoc.recentFiles.findIndex(entry => entry.key === key);

    if (existingIndex !== -1) {
      // Update the timestamp of the existing entry
      userDoc.recentFiles[existingIndex].time = new Date();
    } else {
      // Add a new entry if the key doesn't exist
      userDoc.recentFiles = [
        ...userDoc.recentFiles,
        { key, time: new Date() }
      ];

      // Keep only the last 6 entries in the array
      userDoc.recentFiles = userDoc.recentFiles.slice(-6);
    }
  }

  await db.connection.collection("users").updateOne({ uid: uid }, { $set: userDoc });
  return true
}