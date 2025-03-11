-- CreateTable
CREATE TABLE "ZipRunOutbox" (
    "id" TEXT NOT NULL,
    "zipRunId" TEXT NOT NULL,

    CONSTRAINT "ZipRunOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZipRunOutbox_zipRunId_key" ON "ZipRunOutbox"("zipRunId");

-- AddForeignKey
ALTER TABLE "ZipRunOutbox" ADD CONSTRAINT "ZipRunOutbox_zipRunId_fkey" FOREIGN KEY ("zipRunId") REFERENCES "ZipRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
