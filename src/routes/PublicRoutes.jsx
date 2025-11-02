import { Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import PetDetailsPage from '../pages/PetDetailsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

const PublicRoutes = () => {
  return (
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/pets/:id" element={<PetDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </>
  );
};

export default PublicRoutes;

