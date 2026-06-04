-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('FREE', 'PRO', 'BUSINESS', 'PROMO');

-- CreateEnum
CREATE TYPE "ToneType" AS ENUM ('NEUTRAL', 'PROFESSIONAL', 'CASUAL', 'FRIENDLY', 'FORMAL', 'CONVERSATIONAL', 'ASSERTIVE', 'EMPATHETIC');

-- CreateEnum
CREATE TYPE "LengthPreference" AS ENUM ('ORIGINAL', 'SHORTER', 'LONGER', 'CONCISE', 'ADD_MORE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "avatarUrl" TEXT,
    "plan" "UserPlan" NOT NULL DEFAULT 'FREE',
    "creditsRemaining" INTEGER NOT NULL DEFAULT 5,
    "creditsResetDate" TIMESTAMP(3),
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Framework" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "tone" "ToneType" NOT NULL,
    "formalityLevel" INTEGER NOT NULL,
    "creativityLevel" INTEGER NOT NULL,
    "lengthPreference" "LengthPreference" NOT NULL,
    "preserveStyle" BOOLEAN NOT NULL DEFAULT true,
    "enhanceClarity" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Framework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PolishHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "frameworkId" TEXT,
    "originalText" TEXT NOT NULL,
    "polishedText" TEXT NOT NULL,
    "creditsUsed" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PolishHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Framework_userId_idx" ON "Framework"("userId");

-- CreateIndex
CREATE INDEX "PolishHistory_userId_idx" ON "PolishHistory"("userId");

-- CreateIndex
CREATE INDEX "PolishHistory_frameworkId_idx" ON "PolishHistory"("frameworkId");

-- AddForeignKey
ALTER TABLE "Framework" ADD CONSTRAINT "Framework_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolishHistory" ADD CONSTRAINT "PolishHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolishHistory" ADD CONSTRAINT "PolishHistory_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework"("id") ON DELETE SET NULL ON UPDATE CASCADE;
