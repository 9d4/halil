-- DropForeignKey
ALTER TABLE "public"."Todo" DROP CONSTRAINT "Todo_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TodoItem" DROP CONSTRAINT "TodoItem_todoId_fkey";

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoItem" ADD CONSTRAINT "TodoItem_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
