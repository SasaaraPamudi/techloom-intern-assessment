import { useId } from "react"
import { SearchIcon } from "lucide-react"

export default function Navbar({ activeTab, setActiveTab, cartItemCount, searchQuery, setSearchQuery }) {
  const id = useId()

  const headerStyle = {
    display: 'flex',
    height: '70px',
    padding: '0 24px',
    backgroundColor: '#11140D',
    borderBottom: '1px solid #2B3024',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#FDFDFD',
    fontFamily: "'Playfair Display', Georgia, serif"
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
    color: '#FDFDFD',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Playfair Display', Georgia, serif"
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
    backgroundColor: activeTab === tabName ? '#F4EC00' : 'transparent',
    color: activeTab === tabName ? '#11140D' : '#9CA3AF',
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
    backgroundColor: '#1B1E16',
    border: '1px solid #2B3024',
    borderRadius: '6px',
    color: '#FDFDFD',
    fontSize: '0.9rem',
    outline: 'none'
  };

  const searchIconStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: '#9CA3AF',
    pointerEvents: 'none'
  };

  const cartButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#F4EC00',
    color: '#11140D',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem'
  };

  const badgeStyle = {
    backgroundColor: '#11140D',
    color: '#F4EC00',
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
            Products
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