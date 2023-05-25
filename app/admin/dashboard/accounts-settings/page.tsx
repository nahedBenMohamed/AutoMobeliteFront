"use client"

// ** React Imports
import React, { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import TabAccount from "@/app/admin/component/accounts-settings/TabAccount";
import TabSecurity from "@/app/admin/component/accounts-settings/TabSecurity";
import Navbar from "@/app/admin/component/dashboard/NavBar";

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        minWidth: 100
    },
    [theme.breakpoints.down('sm')]: {
        minWidth: 67
    }
}))

const TabName = styled('span')(({ theme }) => ({
    lineHeight: 1.71,
    fontSize: '0.875rem',
    marginLeft: theme.spacing(2.4),
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}))

const AccountSettings = () => {
    // ** State
    const [value, setValue] = useState<string>('account')

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }
    const mainStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
    };
    const cardStyles = {
        width: '900px',
        paddingTop: '5px',
    };

    return (
        <main>
            <Navbar/>
            <div style={mainStyles}>
                <Card style={cardStyles}>
                    <TabContext value={value}>
                        <TabList
                            onChange={handleChange}
                            aria-label='account-settings tabs'
                            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                        >
                            <Tab
                                value='account'
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccountOutline />
                                        <TabName>Account</TabName>
                                    </Box>
                                }
                            />
                            <Tab
                                value='security'
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LockOpenOutline />
                                        <TabName>Security</TabName>
                                    </Box>
                                }
                            />
                        </TabList>

                        <TabPanel sx={{ p: 0 , marginBottom: '16px'}} value='account'>
                            <TabAccount />
                        </TabPanel>
                        <TabPanel sx={{ p: 0 }} value='security'>
                            <TabSecurity />
                        </TabPanel>
                    </TabContext>
                </Card>
            </div>
        </main>
    )
}

export default AccountSettings
