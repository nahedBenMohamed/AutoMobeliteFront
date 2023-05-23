import React, { useState, ChangeEvent, FormEvent } from "react";

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import Phone from 'mdi-material-ui/Phone'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import { LockOutline } from 'mdi-material-ui';

const Editprofile = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Ajoutez ici votre logique de mise à jour du profil
        console.log(formData);
    };

    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
          <h2 className="text-2xl font-bold mb-4">Your account Information</h2>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Name'
                  placeholder='Carter'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AccountOutline />
                      </InputAdornment>
                    )}}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='First Name'
                  placeholder='Leonard'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AccountOutline />
                      </InputAdornment>
                    )}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='carterleonard@gmail.com'
                  helperText='You can use letters & numbers '
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <EmailOutline />
                      </InputAdornment>
                    )}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='number'
                  label='Phone No.'
                  placeholder='+1-123-456-8790'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Phone />
                      </InputAdornment>
                    )}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Current Password'
                  type="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <LockOutline />
                      </InputAdornment>
                    )
                }}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='New Password'
                  type="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <LockOutline />
                      </InputAdornment>
                    )}}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Confirm Password'
                  type="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <LockOutline />
                      </InputAdornment>
                    )}}/>
              </Grid>
              <Grid item xs={12}>
                <Button type='submit' variant='contained' size='large' className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>

    );
}


export default Editprofile;
