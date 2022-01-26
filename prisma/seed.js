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

    console.log( 'Time now: ', screeningTime );

    // Set screening time to tomorrow at 8pm - there are libraries that will do this :)
    const eightPM = 20;
    const hrsToMillis = 60 * 60 * 1000;
    const offset = ( 24 + ( eightPM - screeningTime.getHours() ) ) * hrsToMillis;

    screeningTime.setTime( screeningTime.getTime() + offset );
    screeningTime.setMinutes( 0 );
    screeningTime.setSeconds( 0 );

    console.log( 'Screening time: ', screeningTime );

    const aScreening = await prisma.screening.create({
        data: {
            movieId:  dune.id,
            startsAt: screeningTime
        }
    });

    console.log( 'Screening for `Dune` created', aScreening );

    // Don't edit any of the code below this line
    process.exit(0);
}

seed()
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    })
