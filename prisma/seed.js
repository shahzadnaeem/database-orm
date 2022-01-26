const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function nextDayScreeningDate( screeningHour ) {
    const nextDate = new Date();
    const hrsToMillis = 60 * 60 * 1000;
    const offset = ( 24 + ( screeningHour - nextDate.getHours() ) ) * hrsToMillis;

    nextDate.setTime( nextDate.getTime() + offset );
    nextDate.setMinutes( 0 );
    nextDate.setSeconds( 0 );

    return nextDate;
}

async function seed() {

    // Nested creation of Customer Contact
    const bob = await prisma.customer.create({
        data: {
            name: 'Bobby TABLES',
            contact: {
                create: {
                    phone: '0141 666 9999',
                    email: 'bobby.TABLES@example.com'
                }
            }
        }
    });

    console.log('Customer/Contact `Bobby TABLES` created', bob);

    // Manual creation of Customer and Contact
    const createdCustomer = await prisma.customer.create({
        data: {
            name: 'Alice'
        }
    });

    console.log('Customer `Alice` created', createdCustomer);

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

    const screeningTime = nextDayScreeningDate( 20 );

    const aScreening = await prisma.screening.create({
        data: {
            movieId:  dune.id,
            startsAt: screeningTime
        }
    });

    console.log( 'Screening for `Dune` created', aScreening );

    const titane = await prisma.movie.create({
        data: {
            title: "Titane",
            runTimeMins: 100,
            screenings: {
                create: [
                    { startsAt: nextDayScreeningDate( 22 ) },
                    { startsAt: nextDayScreeningDate( 24 ) }
                ]
            }
        }
    });

    console.log( 'Movie `Titane` created with Screenings', titane );

    // Don't edit any of the code below this line
    process.exit(0);
}

seed()
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    })
