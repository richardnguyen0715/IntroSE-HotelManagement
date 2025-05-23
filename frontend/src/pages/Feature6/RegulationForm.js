import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Grid } from '@mui/material';
import { useBill } from '../Feature4/BillContext';

const RegulationForm = () => {
    const { regulations, updateRegulation } = useBill();
    const [formData, setFormData] = useState({
        thirdPersonSurcharge: regulations.thirdPersonSurcharge,
        foreignerCoefficient: regulations.foreignerCoefficient,
        basePrice: regulations.basePrice
    });

    const handleChange = (field) => (event) => {
        const value = parseFloat(event.target.value);
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Object.entries(formData).forEach(([key, value]) => {
            updateRegulation(key, value);
        });
        alert('Quy định đã được cập nhật thành công!');
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
            <Typography variant="h5" gutterBottom>
                Thay đổi Quy định 4
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Đơn giá cơ bản (cho 2 khách)"
                            type="number"
                            value={formData.basePrice}
                            onChange={handleChange('basePrice')}
                            inputProps={{ step: "1000" }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phụ thu khách thứ 3 (%)"
                            type="number"
                            value={formData.thirdPersonSurcharge * 100}
                            onChange={(e) => handleChange('thirdPersonSurcharge')(
                                { target: { value: parseFloat(e.target.value) / 100 } }
                            )}
                            inputProps={{ min: 0, max: 100, step: "1" }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Hệ số khách nước ngoài"
                            type="number"
                            value={formData.foreignerCoefficient}
                            onChange={handleChange('foreignerCoefficient')}
                            inputProps={{ min: 1, step: "0.1" }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Cập nhật quy định
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default RegulationForm; 