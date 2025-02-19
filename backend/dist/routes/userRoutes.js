"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const types_1 = require("../types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const saltRounds = 10;
exports.prisma = new client_1.PrismaClient();
exports.userRouter = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET;
exports.userRouter.get("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ message: "Unauthorized, no token in cookies" });
    }
    return res.status(200).json({
        token: token,
    });
}));
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password } = req.body;
    const validInputs = types_1.signupZodSchema.safeParse({
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
        const isExist = yield exports.prisma.player.findUnique({
            where: {
                email: email,
            },
        });
        if (isExist) {
            return res.status(409).json({
                message: "User already exists!!",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
        const newPlayer = yield exports.prisma.player.create({
            data: {
                userName: userName,
                email: email,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newPlayer.id }, JWT_SECRET);
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
    }
    catch (error) {
        return res.status(500).json({
            message: "User signup fails",
            error: error,
        });
    }
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const validInputs = types_1.signinZodSchema.safeParse({
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
            const isUserExist = yield exports.prisma.player.findUnique({
                where: {
                    email: email,
                },
            });
            if (!isUserExist) {
                return res.status(409).json({
                    message: "User not exists",
                });
            }
            const authenticated = yield bcryptjs_1.default.compare(password, isUserExist.password);
            if (!authenticated) {
                return res.status(409).json({
                    message: "Please enter correct password",
                });
            }
            const token = jsonwebtoken_1.default.sign({ userId: isUserExist.id }, JWT_SECRET);
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
        }
        catch (e) {
            return res.status(500).json({
                message: "User signin fails!!!",
                error: e,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "User signin fails!!!",
            error: error,
        });
    }
}));
exports.userRouter.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(200).json({
                message: "Player already logout!!",
            });
        }
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = payload.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Player unauthorized!!!",
            });
        }
        res.clearCookie("token");
        return res.status(200).json({
            message: "Player logout successfully!!!",
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Error while logout!!!",
            e: e,
        });
    }
}));
exports.userRouter.get("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ message: "Unauthorized, no token in cookies" });
    }
    const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    const userId = payload.userId;
    try {
        const user = yield exports.prisma.player.findUnique({
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
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "User finding fails!", error: error });
    }
}));
