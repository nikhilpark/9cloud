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
    console.log(mongoUser, "mongoUser")
    if (mongoUser) return JSON.stringify(mongoUser)
    const newUser = {
        email: user.email,
        uid: uid,
        picture: user.picture,
        name: user.name,
        sub:user.sub
    }
    await db.connection.collection("users").insertOne(newUser)
    return JSON.stringify(newUser)

}
export async function getUserId() {
  try{
    console.log("Getting user id")
    const db = await dbPromise()
console.log("After db")
    let session = await getSession();
    console.log("session",session)
    if (!session) return JSON.stringify('')
    const user = session.user
    const uid = getUidFromSub(user.sub)
    const mongoUser = await db.connection.collection("users").findOne({ uid: uid })
    if (mongoUser) return mongoUser.uid
    return ''
  } catch(err){
    console.log(err)
    return ''
  }
}

export async function updateFileAccessTime(uid:string,key:string){
    const db = await dbPromise()

    const  userDoc = await db.connection.collection("users").findOne({uid:uid})
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