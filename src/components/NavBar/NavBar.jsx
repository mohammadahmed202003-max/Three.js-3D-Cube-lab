import styles from './NavBar.module.css'

// if wanna add tabs will edit only here in this array, and the rest of the code will work without any changes
const TABS = [
  { id: 'cube',  label: 'Fitts Law Test 1' },
  { id: 'fitts', label: 'Fitts Law Test 2' },
]

function NavBar({ activeTab, onTabChange }) {
  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>HCI Lab</span>
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            data-tab={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default NavBar
