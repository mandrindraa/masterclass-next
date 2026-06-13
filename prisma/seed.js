"use strict";
/**
 * prisma/seed.ts
 * Seeds the database with an initial Surveillant account.
 * Run with: npx prisma db seed
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var adapter_pg_1 = require("@prisma/adapter-pg");
var bcryptjs_1 = require("bcryptjs");
var client_1 = require("../lib/generated/prisma/client");
var adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
var prisma = new client_1.PrismaClient({ adapter: adapter });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var surveillantEmail, surveillantPassword, existing, passwordHash, year, subjects, sampleClass;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("🌱 Seeding database...");
                    surveillantEmail = (_a = process.env.SEED_SURVEILLANT_EMAIL) !== null && _a !== void 0 ? _a : "admin@school.mg";
                    surveillantPassword = (_b = process.env.SEED_SURVEILLANT_PASSWORD) !== null && _b !== void 0 ? _b : "Admin@1234!";
                    return [4 /*yield*/, prisma.user.findUnique({
                            where: { email: surveillantEmail },
                        })];
                case 1:
                    existing = _c.sent();
                    if (!!existing) return [3 /*break*/, 4];
                    return [4 /*yield*/, bcryptjs_1.default.hash(surveillantPassword, 12)];
                case 2:
                    passwordHash = _c.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: surveillantEmail,
                                passwordHash: passwordHash,
                                role: client_1.Role.SURVEILLANT,
                                status: client_1.UserStatus.ACTIVE,
                            },
                        })];
                case 3:
                    _c.sent();
                    console.log("\u2705 Created Surveillant: ".concat(surveillantEmail));
                    console.log("   Default password: ".concat(surveillantPassword));
                    console.log("   ⚠️  Change this password immediately after first login!");
                    return [3 /*break*/, 5];
                case 4:
                    console.log("\u2139\uFE0F  Surveillant already exists: ".concat(surveillantEmail));
                    _c.label = 5;
                case 5:
                    if (!(process.env.SEED_SAMPLE_DATA === "true")) return [3 /*break*/, 9];
                    return [4 /*yield*/, prisma.academicYear.upsert({
                            where: { id: "seed-academic-year-2025" },
                            update: {},
                            create: {
                                id: "seed-academic-year-2025",
                                label: "2024-2025",
                                periodType: "TRIMESTER",
                                periodCount: 3,
                                startDate: new Date("2024-10-01"),
                                endDate: new Date("2025-07-31"),
                                isActive: true,
                                periods: {
                                    create: [
                                        {
                                            number: 1,
                                            label: "Trimestre 1",
                                            startDate: new Date("2024-10-01"),
                                            endDate: new Date("2024-12-31"),
                                        },
                                        {
                                            number: 2,
                                            label: "Trimestre 2",
                                            startDate: new Date("2025-01-06"),
                                            endDate: new Date("2025-03-31"),
                                        },
                                        {
                                            number: 3,
                                            label: "Trimestre 3",
                                            startDate: new Date("2025-04-07"),
                                            endDate: new Date("2025-07-31"),
                                        },
                                    ],
                                },
                            },
                        })];
                case 6:
                    year = _c.sent();
                    console.log("\u2705 Created sample academic year: ".concat(year.label));
                    return [4 /*yield*/, Promise.all([
                            prisma.subject.upsert({
                                where: { id: "seed-sub-math" },
                                update: {},
                                create: { id: "seed-sub-math", name: "Mathématiques", coefficient: 4 },
                            }),
                            prisma.subject.upsert({
                                where: { id: "seed-sub-fr" },
                                update: {},
                                create: { id: "seed-sub-fr", name: "Français", coefficient: 3 },
                            }),
                            prisma.subject.upsert({
                                where: { id: "seed-sub-mg" },
                                update: {},
                                create: { id: "seed-sub-mg", name: "Malagasy", coefficient: 2 },
                            }),
                            prisma.subject.upsert({
                                where: { id: "seed-sub-sci" },
                                update: {},
                                create: {
                                    id: "seed-sub-sci",
                                    name: "Sciences Physiques",
                                    coefficient: 3,
                                },
                            }),
                        ])];
                case 7:
                    subjects = _c.sent();
                    console.log("\u2705 Created ".concat(subjects.length, " sample subjects"));
                    return [4 /*yield*/, prisma.class.upsert({
                            where: { id: "seed-class-term-a" },
                            update: {},
                            create: {
                                id: "seed-class-term-a",
                                name: "Terminale A",
                                level: "Terminale",
                                academicYearId: year.id,
                            },
                        })];
                case 8:
                    sampleClass = _c.sent();
                    console.log("\u2705 Created sample class: ".concat(sampleClass.name));
                    _c.label = 9;
                case 9:
                    console.log("✅ Seeding complete.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error("❌ Seed failed:", e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
