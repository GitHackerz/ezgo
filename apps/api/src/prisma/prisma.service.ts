import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  get company() {
    return this.prisma.company;
  }

  get user() {
    return this.prisma.user;
  }

  get bus() {
    return this.prisma.bus;
  }

  get route() {
    return this.prisma.route;
  }

  get trip() {
    return this.prisma.trip;
  }

  get booking() {
    return this.prisma.booking;
  }
}
