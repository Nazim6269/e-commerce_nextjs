"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const orders = [
    {
        id: "ORD001",
        customer: "John Doe",
        status: "Pending",
        total: "$250.00",
        date: "2023-01-15",
    },
    {
        id: "ORD002",
        customer: "Jane Smith",
        status: "Completed",
        total: "$120.50",
        date: "2023-01-14",
    },
    {
        id: "ORD003",
        customer: "Bob Johnson",
        status: "Processing",
        total: "$450.00",
        date: "2023-01-14",
    },
    {
        id: "ORD004",
        customer: "Alice Brown",
        status: "Completed",
        total: "$60.00",
        date: "2023-01-13",
    },
    {
        id: "ORD005",
        customer: "Charlie Wilson",
        status: "Cancelled",
        total: "$35.00",
        date: "2023-01-12",
    },
];

export default function AdminOrders() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            order.status === "Completed"
                                                ? "default"
                                                : order.status === "Pending"
                                                    ? "secondary"
                                                    : order.status === "Cancelled"
                                                        ? "destructive"
                                                        : "outline"
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{order.total}</TableCell>
                                <TableCell>{order.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
