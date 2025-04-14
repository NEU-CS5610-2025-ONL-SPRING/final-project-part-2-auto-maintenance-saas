import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const services = [
  {
    name: "Oil Change",
    price: 49.99,
    duration: 30,
    description:
      "Regular oil change service including oil filter replacement. We use high-quality synthetic oil to ensure optimal engine performance and longevity.",
  },
  {
    name: "Tire Rotation",
    price: 29.99,
    duration: 30,
    description:
      "Professional tire rotation service to ensure even wear and extend tire life. Includes inspection of tire pressure and tread depth.",
  },
  {
    name: "Brake Service",
    price: 129.99,
    duration: 60,
    description:
      "Complete brake inspection and service. Includes checking brake pads, rotors, and fluid levels. Replacement of worn components as needed.",
  },
  {
    name: "Battery Check",
    price: 19.99,
    duration: 15,
    description:
      "Comprehensive battery health check including voltage test, terminal inspection, and charging system evaluation.",
  },
  {
    name: "Air Filter Replacement",
    price: 24.99,
    duration: 15,
    description:
      "Replace your vehicle's air filter to improve engine performance and fuel efficiency. Includes inspection of the air intake system.",
  },
  {
    name: "Wheel Alignment",
    price: 79.99,
    duration: 45,
    description:
      "Professional wheel alignment service to ensure proper handling and prevent uneven tire wear. Includes adjustment of camber, caster, and toe angles.",
  },
];

async function main() {
  console.log("Start seeding...");

  try {
    // First, delete all appointments to handle foreign key constraints
    await prisma.appointment.deleteMany();
    console.log("Deleted existing appointments");

    // Then delete all services
    await prisma.service.deleteMany();
    console.log("Deleted existing services");

    // Then create new services
    for (const service of services) {
      await prisma.service.create({
        data: service,
      });
      console.log(`Created service: ${service.name}`);
    }

    console.log("Seeding finished successfully");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
