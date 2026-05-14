-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'EMAIL', 'NUMBER', 'PHONE', 'MCQ', 'CHECKLIST', 'DROPDOWN', 'DATE', 'SECTION', 'SECTION_BREAK');

-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" "FormStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormField" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "order" INTEGER NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "placeholder" TEXT,
    "sectionTitle" TEXT,
    "sectionDescription" TEXT,
    "options" TEXT[],
    "validationMinLength" INTEGER,
    "validationMaxLength" INTEGER,
    "validationMin" DOUBLE PRECISION,
    "validationMax" DOUBLE PRECISION,

    CONSTRAINT "FormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormVersion" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormVersionField" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "order" INTEGER NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "placeholder" TEXT,
    "sectionTitle" TEXT,
    "sectionDescription" TEXT,
    "options" TEXT[],
    "validationMinLength" INTEGER,
    "validationMaxLength" INTEGER,
    "validationMin" DOUBLE PRECISION,
    "validationMax" DOUBLE PRECISION,

    CONSTRAINT "FormVersionField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormAssignment" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponse" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormField_formId_order_idx" ON "FormField"("formId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "FormVersion_formId_versionNumber_key" ON "FormVersion"("formId", "versionNumber");

-- CreateIndex
CREATE INDEX "FormVersionField_versionId_order_idx" ON "FormVersionField"("versionId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "FormAssignment_formId_employeeId_key" ON "FormAssignment"("formId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponse_versionId_employeeId_key" ON "FormResponse"("versionId", "employeeId");

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormVersion" ADD CONSTRAINT "FormVersion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormVersionField" ADD CONSTRAINT "FormVersionField_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "FormVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAssignment" ADD CONSTRAINT "FormAssignment_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAssignment" ADD CONSTRAINT "FormAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "FormVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
