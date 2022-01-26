-- Some queries for examining the data created in seed.js

-- The ElephantSQL browser works for tables

-- Queries are a bit trickier due to the way PostgresSQL needs to "DoubleQuote" mixed case identifiers due to it being case insensitive - mixed case things won't be found otherwise

-- Tickets

SELECT *
FROM "prisma"."Ticket" t, "prisma"."Customer" c, "prisma"."Screening" scg, "prisma"."Movie" m
WHERE t."customerId" = c.id AND t."screeningId" = scg.id AND scg."movieId" = m.id

-- same as above, but using JOINs

SELECT *
FROM "prisma"."Ticket" t
INNER JOIN "prisma"."Customer" c on ( t."customerId" = c.id )
INNER JOIN "prisma"."Screening" scg on ( t."screeningId" = scg.id )
INNER JOIN "prisma"."Movie" m on ( scg."movieId" = m.id )
INNER JOIN "prisma"."Screen" scn on ( scg."screenId" = scn.id )
