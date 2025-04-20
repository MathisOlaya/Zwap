-- CreateTable
CREATE TABLE "ZohoToken" (
    "id" SERIAL NOT NULL,
    "accessToken" TEXT NOT NULL,
    "expiresIn" INTEGER NOT NULL,

    CONSTRAINT "ZohoToken_pkey" PRIMARY KEY ("id")
);
