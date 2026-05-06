import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import OpportunityDetail from './pages/OpportunityDetail';
import Contracts from './pages/Contracts';
import ContractDetail from './pages/ContractDetail';
import Handoffs from './pages/Handoffs';
import HandoffDetail from './pages/HandoffDetail';
import Delivery from './pages/Delivery';
import DeliveryDetail from './pages/DeliveryDetail';
import Portfolio from './pages/Portfolio';
import Catalog from './pages/Catalog';
import Agent from './pages/Agent';
import Backlog from './pages/Backlog';

// Strip trailing slash so React Router gets a clean basename
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/pipeline/:id" element={<OpportunityDetail />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/contracts/:id" element={<ContractDetail />} />
              <Route path="/handoffs" element={<Handoffs />} />
              <Route path="/handoffs/:id" element={<HandoffDetail />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/delivery/:id" element={<DeliveryDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/backlog" element={<Backlog />} />
              <Route path="/agent" element={<Agent />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
