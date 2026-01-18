import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const customers = [
    { id: 1, name: "John Doe", email: "john@example.com", orders: 5, totalSpent: "$1,250.00" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", orders: 3, totalSpent: "$450.50" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", orders: 12, totalSpent: "$3,450.00" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", orders: 8, totalSpent: "$960.00" },
    { id: 5, name: "Charlie Wilson", email: "charlie@example.com", orders: 2, totalSpent: "$35.00" },
];

export default function CustomersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customer Directory</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Total Spent</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{customer.name}</span>
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.orders}</TableCell>
                                    <TableCell>{customer.totalSpent}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
