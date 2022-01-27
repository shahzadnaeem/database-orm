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

    // Customer and Contacts

    // Nested creation of Customer Contact
    const bobby = await prisma.customer.create({
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

    console.log('Customer/Contact `Bobby TABLES` created', bobby);

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

    // Screens

    const screen1 = await prisma.screen.create({
        data: { number: 1 }
    });

    console.log('Screen 1 created', screen1);

    const screen2 = await prisma.screen.create({
        data: { number: 2 }
    });

    console.log('Screen 2 created', screen1);

    const moreScreens = await prisma.screen.createMany({
        data: [
            { number: 10 },
            { number: 11 }
        ]
    });

    console.log('Screens 10 and 11 created using createMany()');

    // Movies and Screenings

    const dune = await prisma.movie.create({
        data: {
            title: "Dune",
            runTimeMins: 170
        }
    });

    console.log('Movie `Dune` created', dune );

    const screeningTime = nextDayScreeningDate( 20 );

    const duneScreening = await prisma.screening.create({
        data: {
            movieId:  dune.id,
            screenId: screen1.id,
            startsAt: screeningTime
        }
    });

    console.log( 'Screening for `Dune` created', duneScreening );

    const titane = await prisma.movie.create({
        data: {
            title: "Titane",
            runTimeMins: 100,
            screenings: {
                create: [
                    {
                        screenId: screen1.id,
                        startsAt: nextDayScreeningDate( 22 )
                    },
                    {
                        screenId: screen1.id,
                        startsAt: nextDayScreeningDate( 24 )
                    },
                    {
                        screenId: screen2.id,
                        startsAt: nextDayScreeningDate( 20 )
                    }
                ]
            }
        }
    });

    console.log( 'Movie `Titane` created with 3 Screenings', titane );

    // Tickets
    const bobbysTicketForDune = await prisma.ticket.create({
        data: {
            customerId: bobby.id,
            screeningId: duneScreening.id
        }
    });

    console.log( 'Ticket for `Bobby` to see `Dune` created', bobbysTicketForDune );

    // Don't edit any of the code below this line
    process.exit(0);
}

seed()
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    })
