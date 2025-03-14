-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zip" (
    "id" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,

    CONSTRAINT "Zip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "zipId" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableTrigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AvailableTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "zipId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "sortingOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvalaibleAction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AvalaibleAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZipRun" (
    "id" TEXT NOT NULL,
    "zipId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "ZipRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZipRunOutbox" (
    "id" TEXT NOT NULL,
    "zipRunId" TEXT NOT NULL,

    CONSTRAINT "ZipRunOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_zipId_key" ON "Trigger"("zipId");

-- CreateIndex
CREATE UNIQUE INDEX "ZipRunOutbox_zipRunId_key" ON "ZipRunOutbox"("zipRunId");

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "AvailableTrigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_zipId_fkey" FOREIGN KEY ("zipId") REFERENCES "Zip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_zipId_fkey" FOREIGN KEY ("zipId") REFERENCES "Zip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "AvalaibleAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZipRun" ADD CONSTRAINT "ZipRun_zipId_fkey" FOREIGN KEY ("zipId") REFERENCES "Zip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZipRunOutbox" ADD CONSTRAINT "ZipRunOutbox_zipRunId_fkey" FOREIGN KEY ("zipRunId") REFERENCES "ZipRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
