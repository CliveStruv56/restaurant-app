
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const partySize = searchParams.get('partySize');

    if (!date || !time || !partySize) {
      return NextResponse.json(
        { error: 'Missing required parameters: date, time, partySize' },
        { status: 400 }
      );
    }

    const partySizeNum = parseInt(partySize);
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000); // 90 minutes

    // Get all tables that can accommodate the party size
    const suitableTables = await prisma.table.findMany({
      where: {
        isActive: true,
        capacity: {
          gte: partySizeNum,
        },
      },
    });

    // Check availability for each table
    const availabilityPromises = suitableTables.map(async (table) => {
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          tableId: table.id,
          status: {
            in: ['CONFIRMED'],
          },
          OR: [
            {
              AND: [
                { startTime: { lte: startDateTime } },
                { endTime: { gt: startDateTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endDateTime } },
                { endTime: { gte: endDateTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: startDateTime } },
                { endTime: { lte: endDateTime } },
              ],
            },
          ],
        },
      });

      return {
        ...table,
        isAvailable: conflictingBookings.length === 0,
      };
    });

    const tablesWithAvailability = await Promise.all(availabilityPromises);

    return NextResponse.json({
      date,
      time,
      partySize: partySizeNum,
      tables: tablesWithAvailability,
      availableTables: tablesWithAvailability.filter(table => table.isAvailable),
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
