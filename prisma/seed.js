const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {

    const bob = await prisma.customer.create({
        data: {
            name: 'Bobby TABLES'
        }
    });

    console.log('Customer `Bobby TABLES` created', bob);

    const createdCustomer = await prisma.customer.create({
        data: {
            name: 'Alice'
        }
    });

    console.log('Customer `Alice` created', createdCustomer);

    // Add your code here

    const createdContact = await prisma.contact.create({
        data: {
            customerId: createdCustomer.id,
            phone: '0131 334 6523',
            email: 'alice@example.com'
        }
    });

    console.log('Contact `Alice` created - linked to Customer', createdContact);

    const dune = await prisma.movie.create({
        data: {
            title: "Dune",
            runTimeMins: 170
        }
    });

    console.log('Movie `Dune` created', dune );

    let screeningTime = new Date();

    screeningTime.setHours( screeningTime.getHours() + 20 );
    screeningTime.setMinutes( 0 );
    screeningTime.setSeconds( 0 );

    const aScreening = await prisma.screening.create({
        data: {
            startsAt: screeningTime
        }
    });

    console.log( 'Screening created', aScreening );

    // Don't edit any of the code below this line
    process.exit(0);
}

seed()
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    })
