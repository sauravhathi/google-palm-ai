import { NextApiResponse } from "next";

const methodNotAllowed = (res: NextApiResponse) => {
    res.status(405).json({ error: "Method not allowed" });
  };

export default methodNotAllowed;