import prisma from '../database/prisma.js';

export const Attendee = {
  // Find one attendee by condition
  async findOne(condition) {
    try {
      return await prisma.attendee.findFirst({
        where: condition,
      });
    } catch (error) {
      throw error;
    }
  },

  // Find attendee by ID
  async findById(id) {
    try {
      return await prisma.attendee.findUnique({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      throw error;
    }
  },

  // Create new attendee
  async create(data) {
    try {
      return await prisma.attendee.create({
        data,
      });
    } catch (error) {
      throw error;
    }
  },

  // Update attendee
  async update(id, data) {
    try {
      return await prisma.attendee.update({
        where: { id: parseInt(id) },
        data,
      });
    } catch (error) {
      throw error;
    }
  },

  // Find with query conditions
  async find(query = {}) {
    try {
      const where = {};

      // Handle $or conditions (search)
      if (query.$or) {
        where.OR = query.$or.map((condition) => {
          const key = Object.keys(condition)[0];
          const value = condition[key].$regex || condition[key];
          // Remove $regex prefix if present
          const searchValue = typeof value === 'string' ? value.replace(/^\^|\$$/g, '') : value;
          return {
            [key]: {
              contains: searchValue,
            },
          };
        });
      }

      // Handle designation filter
      if (query.designation) {
        where.designation = query.designation;
      }

      // Handle isScanned filter
      if (query.isScanned !== undefined) {
        where.isScanned = query.isScanned;
      }

      const options = {
        where,
        orderBy: { createdAt: 'desc' },
      };

      // Handle pagination
      if (query.skip !== undefined && query.limit !== undefined) {
        options.skip = query.skip;
        options.take = query.limit;
      }

      // Exclude qrCode if needed (for list views)
      if (query.select && query.select.includes('-qrCode')) {
        options.select = {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          designation: true,
          passedOutYear: true,
          profilePhoto: true,
          attendeeCode: true,
          isScanned: true,
          entryTime: true,
          createdAt: true,
        };
      }

      return await prisma.attendee.findMany(options);
    } catch (error) {
      throw error;
    }
  },

  // Count documents
  async countDocuments(query = {}) {
    try {
      const where = {};

      // Handle $or conditions (search)
      if (query.$or) {
        where.OR = query.$or.map((condition) => {
          const key = Object.keys(condition)[0];
          const value = condition[key].$regex || condition[key];
          // Remove $regex prefix if present
          const searchValue = typeof value === 'string' ? value.replace(/^\^|\$$/g, '') : value;
          return {
            [key]: {
              contains: searchValue,
            },
          };
        });
      }

      // Handle designation filter
      if (query.designation) {
        where.designation = query.designation;
      }

      // Handle isScanned filter
      if (query.isScanned !== undefined) {
        where.isScanned = query.isScanned;
      }

      return await prisma.attendee.count({ where });
    } catch (error) {
      throw error;
    }
  },

  // Aggregate for statistics (category-wise)
  async aggregate(pipeline) {
    try {
      // For category stats using Prisma groupBy
      if (pipeline && pipeline[0] && pipeline[0].$group) {
        const stats = await prisma.attendee.groupBy({
          by: ['designation'],
          _count: {
            id: true,
          },
        });

        // Calculate scanned and pending for each designation
        const result = await Promise.all(
          stats.map(async (stat) => {
            const scanned = await prisma.attendee.count({
              where: {
                designation: stat.designation,
                isScanned: true,
              },
            });
            const pending = stat._count.id - scanned;

            return {
              _id: stat.designation,
              total: stat._count.id,
              scanned,
              pending,
            };
          })
        );

        return result;
      }

      return [];
    } catch (error) {
      throw error;
    }
  },

  // Delete all (for seeding)
  async deleteMany() {
    try {
      return await prisma.attendee.deleteMany({});
    } catch (error) {
      throw error;
    }
  },
};

export default Attendee;
