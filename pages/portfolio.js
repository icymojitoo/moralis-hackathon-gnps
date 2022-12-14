import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { useState } from 'react';
import { getSession } from "next-auth/react";

import Layout from '../components/layout';

export default function Home({ user }) {
    // assets, quantity, price
    const [assets, setAssets] = useState([]);
    const [address, setAddress] = useState('');
  
    const handleAddress = (e) => {
      setAddress(e.target.value);
    }
  
    async function getAssets() {
      setAssets([]);
      await axios
        .get(`https://api.covalenthq.com/v1/137/address/${address}/balances_v2/`, {
          auth: {
            username: process.env.NEXT_PUBLIC_COVALENT_API,
            password: '',
          },
        })
        .then((response) => {
          const items = response.data.data.items;
          for (let i = 0; i < items.length; i++) {
            setAssets((assets) => [
              ...assets,
              {
                name: items[i].contract_name,
                quantity: items[i].balance,
                price: items[i].quote_rate,
              },
            ]);
          }
        });
    }

  return (
    <div>
      <Head>
        <title>Portfolios</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Layout>
            <main>
                <div className='flex justify-center mt-10'>
                    <input type="text" placeholder="Wallet Address" className="input input-bordered w-full max-w-md mx-4" onChange={handleAddress} />
                    <button className="btn" onClick={getAssets}>Get Assets</button>
                    < br/>
                </div>

                <div>
                    <div className="flex justify-center">
                      <div className='classsName="flex justify-center items-center'>
                        {assets.length > 0 && (
                            <table className="table w-full m-2">
                                <thead>
                                    <tr>
                                        <th className="table-cell">#</th>
                                        <th className="table-cell">Asset</th>
                                        <th className="table-cell">Quantity</th>
                                        <th className="table-cell">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.map((asset) => (
                                        <tr key={asset.name}>
                                            <td className="table-cell">{assets.indexOf(asset) + 1}</td>
                                            <td className="table-cell">{asset.name}</td>
                                            <td className="table-cell">{asset.quantity}</td>
                                            <td className="table-cell">{asset.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )} 
                        </div>
                    </div> 
                </div>
            </main>
        </Layout>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // redirect if not authenticated
  if (!session) {
      return {
          redirect: {
              destination: '/',
              permanent: false,
          },
      };
  }

  return {
      props: { user: session.user }
  };
}
