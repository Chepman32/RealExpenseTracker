import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import OrderPage from "@/pages/order-page";
import CarriersPage from "@/pages/carriers-page";
import CarrierRegisterPage from "@/pages/carrier-register-page";
import ProfilePage from "@/pages/profile-page";
import AdminPage from "@/pages/admin-page";
import ServicesPage from "@/pages/services-page";
import LoadersPage from "@/pages/loaders-page";
import AboutPage from "@/pages/about-page";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <HomePage />
      </Route>
      <Route path="/auth">
        <AuthPage />
      </Route>
      <Route path="/services">
        <ServicesPage />
      </Route>
      <Route path="/loaders">
        <LoadersPage />
      </Route>
      <Route path="/about">
        <AboutPage />
      </Route>
      <ProtectedRoute path="/order" component={OrderPage} />
      <Route path="/carriers">
        <CarriersPage />
      </Route>
      <Route path="/carriers/register">
        <CarrierRegisterPage />
      </Route>
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
