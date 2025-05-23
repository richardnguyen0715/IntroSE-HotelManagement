import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useBill } from './BillContext';
import './Feature4.css';

const Feature4Main = () => {
    const { calculateRoomPrice, regulations } = useBill();
    const [billData, setBillData] = useState({
        customerName: '',
        address: '',
        totalAmount: 0,
        items: [
            {
                id: 1,
                room: '',
                days: 0,
                price: regulations.basePrice,
                numGuests: 2,
                hasForeigner: false,
                total: 0
            },
            {
                id: 2,
                room: '',
                days: 0,
                price: regulations.basePrice,
                numGuests: 2,
                hasForeigner: false,
                total: 0
            }
        ]
    });

    const calculateTotal = (item) => {
        const adjustedPrice = calculateRoomPrice(
            item.price,
            item.numGuests,
            item.hasForeigner
        );
        return item.days * adjustedPrice;
    };

    const handleItemChange = (id, field, value) => {
        const newItems = billData.items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                updatedItem.total = calculateTotal(updatedItem);
                return updatedItem;
            }
            return item;
        });

        const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
        setBillData({ ...billData, items: newItems, totalAmount });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Container maxWidth="lg" className="feature4-container">
            <Paper elevation={3} className="bill-paper">
                <Typography variant="h4" align="center" gutterBottom>
                    Hóa Đơn Thanh Toán
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Khách hàng/Cơ quan"
                            value={billData.customerName}
                            onChange={(e) => setBillData({ ...billData, customerName: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Địa chỉ"
                            value={billData.address}
                            onChange={(e) => setBillData({ ...billData, address: e.target.value })}
                        />
                    </Grid>
                </Grid>

                <TableContainer component={Paper} className="bill-table">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Phòng</TableCell>
                                <TableCell>Số Ngày Thuê</TableCell>
                                <TableCell>Đơn Giá</TableCell>
                                <TableCell>Số khách</TableCell>
                                <TableCell>Khách nước ngoài</TableCell>
                                <TableCell>Thành Tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {billData.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>
                                        <TextField
                                            value={item.room}
                                            onChange={(e) => handleItemChange(item.id, 'room', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={item.days}
                                            onChange={(e) => handleItemChange(item.id, 'days', parseInt(e.target.value) || 0)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={item.numGuests}
                                            onChange={(e) => handleItemChange(item.id, 'numGuests', parseInt(e.target.value) || 2)}
                                            inputProps={{ min: 2, max: 3 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={item.hasForeigner}
                                                    onChange={(e) => handleItemChange(item.id, 'hasForeigner', e.target.checked)}
                                                />
                                            }
                                            label=""
                                        />
                                    </TableCell>
                                    <TableCell>{item.total.toLocaleString()} VND</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h6" align="right" className="total-amount">
                    Tổng tiền: {billData.totalAmount.toLocaleString()} VND
                </Typography>

                <Button variant="contained" color="primary" className="print-button" onClick={handlePrint}>
                    In hóa đơn
                </Button>
            </Paper>
        </Container>
    );
};

export default Feature4Main; 