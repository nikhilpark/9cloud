import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Process a POST request
    console.log(req.body)
    console.log("POST request")
    res.send("DONE")
  } else {
    // Handle any other HTTP method
    console.log(req.body)
    console.log("NOT POST request")
    res.send("DONE")

  }
}