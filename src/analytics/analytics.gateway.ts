import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Currency, Transfer } from '@prisma/client';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class AnalyticsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    @WebSocketServer()
    server: Server;

    private connectedClients: Set<Socket> = new Set();
    private readonly ANALYTICS_ID = 'current';

    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        const analytics = await this.prisma.analytics.findUnique({
            where: { id: this.ANALYTICS_ID }
        });

        if (!analytics) {
            await this.initializeAnalytics();
        }
    }

    async handleConnection(client: Socket) {
        this.connectedClients.add(client);
        await this.emitAnalytics();
    }

    handleDisconnect(client: Socket) {
        this.connectedClients.delete(client);
    }

    private async initializeAnalytics() {
        const transfers = await this.prisma.transfer.findMany();
        let totalRevenue = 0;
        const byCurrency = {};

        for (const transfer of transfers) {
            totalRevenue += transfer.amount;
            byCurrency[transfer.currency] = (byCurrency[transfer.currency] || 0) + transfer.amount;
        }

        await this.prisma.analytics.create({
            data: {
                id: this.ANALYTICS_ID,
                totalRevenue,
                transferCount: transfers.length,
                lastUpdated: new Date(),
                byCurrency: {
                    create: Object.entries(byCurrency).map(([currency, amount]) => ({
                        currency: currency as Currency,
                        amount: amount as number
                    }))
                }
            }
        });
    }

    async emitAnalytics() {
        const analytics = await this.prisma.analytics.findUnique({
            where: { id: this.ANALYTICS_ID },
            include: { byCurrency: true }
        });

        if (analytics) {
            this.server.emit('analytics', analytics);
        }
    }

    async updateAnalytics(newTransfer: Transfer) {
        await this.prisma.analytics.update({
            where: { id: this.ANALYTICS_ID },
            data: {
                totalRevenue: { increment: newTransfer.amount },
                transferCount: { increment: 1 },
                lastUpdated: new Date(),
            }
        });

        const currencyAmount = await this.prisma.currencyAmount.findFirst({
            where: {
                analyticsId: this.ANALYTICS_ID,
                currency: newTransfer.currency
            }
        });

        if (currencyAmount) {
            await this.prisma.currencyAmount.update({
                where: { id: currencyAmount.id },
                data: { amount: { increment: newTransfer.amount } }
            });
        } else {
            await this.prisma.currencyAmount.create({
                data: {
                    currency: newTransfer.currency,
                    amount: newTransfer.amount,
                    analyticsId: this.ANALYTICS_ID
                }
            });
        }

        await this.emitAnalytics();
    }
} 