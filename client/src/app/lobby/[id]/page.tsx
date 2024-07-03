"use client";

import styles from './page.module.css'

export default function Page({ params }: { params: { id: string } }) {
    return(
        <main className={styles.main}>
            <div>ID: {params.id}</div>
        </main>
    );
}
