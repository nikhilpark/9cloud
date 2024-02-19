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
    const db = await dbPromise()

    let session = await getSession();
    if (!session) return JSON.stringify('')
    const user = session.user
    const uid = getUidFromSub(user.sub)
    const mongoUser = await db.connection.collection("users").findOne({ uid: uid })
    if (mongoUser) return mongoUser.uid
    return ''

}