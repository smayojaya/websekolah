const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Fetching carousel...");
  const carousels = await prisma.carousel.findMany({ orderBy: { id: 'asc' } });
  if (carousels.length > 0) {
    const first = carousels[0];
    console.log("First carousel image:", first.gambar);
    if (!first.gambar || first.gambar.trim() === '') {
        await prisma.carousel.update({
            where: { id: first.id },
            data: { gambar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1600' }
        });
        console.log("Updated first carousel to a fallback premium image.");
    } else {
        await prisma.carousel.update({
            where: { id: first.id },
            data: { gambar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1600' }
        });
        console.log("Overwriting first carousel image to ensure it is not plain color.");
    }
  }

  console.log("Checking Sekolah runningText...");
  const sekolah = await prisma.sekolah.findUnique({ where: { id: 1 } });
  console.log("RunningText value:", sekolah.runningText);
}

main().then(() => prisma.$disconnect()).catch(err => { console.error(err); prisma.$disconnect(); });
