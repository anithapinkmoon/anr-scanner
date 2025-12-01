import prisma from '../database/prisma.js';
import bcrypt from 'bcryptjs';

export const Admin = {
  // Find one admin by condition
  async findOne(condition) {
    try {
      return await prisma.admin.findFirst({
        where: condition,
      });
    } catch (error) {
      throw error;
    }
  },

  // Find admin by ID
  async findById(id) {
    try {
      return await prisma.admin.findUnique({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      throw error;
    }
  },

  // Create new admin
  async create(data) {
    try {
      const { email, password } = data;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      return admin;
    } catch (error) {
      throw error;
    }
  },

  // Compare password
  async comparePassword(admin, enteredPassword) {
    try {
      // Fetch admin with password
      const adminWithPassword = await prisma.admin.findUnique({
        where: { id: admin.id },
        select: { password: true },
      });

      if (!adminWithPassword) {
        return false;
      }

      return await bcrypt.compare(enteredPassword, adminWithPassword.password);
    } catch (error) {
      throw error;
    }
  },

  // Delete all (for seeding)
  async deleteMany() {
    try {
      return await prisma.admin.deleteMany({});
    } catch (error) {
      throw error;
    }
  },
};

export default Admin;
