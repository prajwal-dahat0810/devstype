import express from "express";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { signinZodSchema, signupZodSchema } from "../types";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const saltRounds = 10;

export const prisma = new PrismaClient();
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Prisma is connected to the database!");
  } catch (error) {
    console.error(" Prisma failed to connect to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseConnection();

export const userRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

userRouter.get(
  "/refresh",
  async (req: Request, res: Response): Promise<any> => {
    const token = await req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token in cookies" });
    }
    return res.status(200).json({
      token: token,
    });
  }
);

userRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<any> => {
    const { userName, email, password } = req.body;
    const validInputs = signupZodSchema.safeParse({
      userName: userName,
      email: email,
      password: password,
    });
    if (!validInputs.success) {
      return res.status(409).json({
        message: "Please check inputs",
        error: validInputs.error.format(),
      });
    }
    try {
      const isExist = await prisma.player.findUnique({
        where: {
          email: email,
        },
      });
      if (isExist) {
        return res.status(409).json({
          message: "User already exists!!",
        });
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newPlayer = await prisma.player.create({
        data: {
          userName: userName,
          email: email,
          password: hashedPassword,
        },
      });
      const token = jwt.sign({ userId: newPlayer.id }, JWT_SECRET as string);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        message: "success",
        user: {
          id: newPlayer.id,
          userName: newPlayer.userName,
          password: newPlayer.password,
          email: newPlayer.email,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "User signup fails",
        error: error,
      });
    }
  }
);
userRouter.patch(
  "/api/user/update",
  async (req: Request, res: Response): Promise<any> => {
    const { userName, password } = req.body;
    if (userName.length > 15) {
      return res.status(409).json({
        message: "Please enter less than 15 character",
      });
    }
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token in cookies" });
    }
    console.log(token, JWT_SECRET);
    const payload = jwt.verify(token, JWT_SECRET as string) as {
      userId: string;
    };

    const userId = payload.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no userId in token" });
    }
    console.log("UserId:", userId);
    try {
      const userPassword = await prisma.player.findFirst({
        where: {
          id: Number(userId),
        },
        select: {
          password: true,
        },
      });
      if (!userPassword) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const isCorrectPassword = await bcrypt.compare(
        password,
        userPassword.password
      );
      if (!isCorrectPassword) {
        return res.status(409).json({
          message: "Please enter correct password",
        });
      }
      const updatedUser = await prisma.player.update({
        where: {
          id: Number(userId),
        },
        data: {
          userName: userName,
        },
        select: {
          userName: true,
          email: true,
          id: true,
        },
      });
      return res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: "User update fails",
        error: error,
      });
    }
  }
);

userRouter.post(
  "/signin",
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    const validInputs = signinZodSchema.safeParse({
      email: email,
      password: password,
    });
    if (!validInputs.success) {
      return res.status(409).json({
        message: "Please check inputs",
        error: validInputs.error.format(),
      });
    }
    console.log(validInputs);
    try {
      try {
        const isUserExist = await prisma.player.findUnique({
          where: {
            email: email,
          },
        });
        if (!isUserExist) {
          return res.status(409).json({
            message: "User not exists",
          });
        }
        console.log(isUserExist);
        const authenticated = await bcrypt.compare(
          password,
          isUserExist.password
        );
        if (!authenticated) {
          return res.status(409).json({
            message: "Please enter correct password",
          });
        }
        const token = jwt.sign(
          { userId: isUserExist.id },
          JWT_SECRET as string
        );
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 3 * 24 * 60 * 60 * 1000,
        });
        // console.log(token);
        return res.status(200).json({
          message: "User signin successfully!!!",
        });
      } catch (e) {
        console.log(e);
        return res.status(500).json({
          message: "User signin fails!!!",
          error: e,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "User signin fails!!!",
        error: error,
      });
    }
  }
);

userRouter.get("/logout", async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({
        message: "Player already logout!!",
      });
    }
    const payload = jwt.verify(token, JWT_SECRET as string) as {
      userId: string;
    };
    const userId = payload.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Player unauthorized!!!",
      });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json({
      message: "Player logout successfully!!!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Error while logout!!!",
      e: e,
    });
  }
});

userRouter.get("/me", async (req: Request, res: Response): Promise<any> => {
  const token = await req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, no token in cookies" });
  }

  const payload = jwt.verify(token, JWT_SECRET as string) as { userId: string };
  const userId = payload.userId;
  try {
    const user = await prisma.player.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        userName: true,
        email: true,
      },
    });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token in cookies" });
    }
    return res.status(200).json({
      message: "ok",
      user: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "User finding fails!", error: error });
  }
});
