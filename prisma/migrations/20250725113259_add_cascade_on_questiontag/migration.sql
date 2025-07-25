-- DropForeignKey
ALTER TABLE "QuestionTag" DROP CONSTRAINT "QuestionTag_questionId_fkey";

-- AddForeignKey
ALTER TABLE "QuestionTag" ADD CONSTRAINT "QuestionTag_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
