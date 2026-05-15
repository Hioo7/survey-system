-- CreateEnum
CREATE TYPE "EditRequestStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "EditRequest" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "EditRequestStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "EditRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
