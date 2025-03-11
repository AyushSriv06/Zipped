-- CreateTable
CREATE TABLE "ZipRun" (
    "id" TEXT NOT NULL,
    "zipId" TEXT NOT NULL,

    CONSTRAINT "ZipRun_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ZipRun" ADD CONSTRAINT "ZipRun_zipId_fkey" FOREIGN KEY ("zipId") REFERENCES "Zip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
