import { useId } from "react"
import { SearchIcon } from "lucide-react"

export default function Navbar({ activeTab, setActiveTab, cartItemCount, searchQuery, setSearchQuery }) {
  const id = useId()

  const headerStyle = {
    display: 'flex',
    height: '70px',
    padding: '0 24px',
    backgroundColor: '#0f172a',
    borderBottom: '1px solid #334155',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#ffffff',
    fontFamily: 'sans-serif'
  };

  const leftGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flex: 1
  };

  const logoStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#38bdf8',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '8px'
  };

  const getLinkButtonStyle = (tabName) => ({
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: activeTab === tabName ? '#1e293b' : 'transparent',
    color: activeTab === tabName ? '#38bdf8' : '#94a3b8',
    transition: 'all 0.2s'
  });

  const searchContainerStyle = {
    position: 'relative',
    maxWidth: '280px',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    height: '36px',
    paddingLeft: '32px',
    paddingRight: '12px',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none'
  };

  const searchIconStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: '#94a3b8',
    pointerEvents: 'none'
  };

  const cartButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem'
  };

  const badgeStyle = {
    backgroundColor: '#ffffff',
    color: '#0369a1',
    fontSize: '0.75rem',
    padding: '2px 6px',
    borderRadius: '999px',
    fontWeight: 'bold'
  };

  return (
    <header style={headerStyle}>
      <div style={leftGroupStyle}>
        <button onClick={() => setActiveTab('products')} style={logoStyle}>
          Techloom Store
        </button>

        <nav style={navLinksStyle}>
          <button onClick={() => setActiveTab('products')} style={getLinkButtonStyle('products')}>
            Catalog
          </button>
          <button onClick={() => setActiveTab('orders')} style={getLinkButtonStyle('orders')}>
            Order History
          </button>
        </nav>

        {setSearchQuery && (
          <div style={searchContainerStyle}>
            <input
              id={id}
              style={inputStyle}
              placeholder="Search products..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div style={searchIconStyle}>
              <SearchIcon size={16} />
            </div>
          </div>
        )}
      </div>

      <div>
        <button onClick={() => setActiveTab('cart')} style={cartButtonStyle}>
          <span>Cart</span>
          <span style={badgeStyle}>{cartItemCount}</span>
        </button>
      </div>
    </header>
  );
}