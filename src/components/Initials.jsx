import styles from './Initials.module.css'

export default function Initials() {
  return (
    <>
      <div className={`${styles.initial} ${styles.left}`}>S</div>
      <div className={`${styles.initial} ${styles.right}`}>B</div>
    </>
  )
}
