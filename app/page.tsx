
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { ChefHat, Clock, Star, Utensils, ShoppingBag, Users, Calendar, MapPin } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  const features = [
    {
      icon: <ChefHat className="h-8 w-8 text-orange-600" />,
      title: "Expert Chefs",
      description: "Our experienced chefs create culinary masterpieces using the finest ingredients"
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "Quick Service",
      description: "Fast and efficient takeaway service with accurate pickup times"
    },
    {
      icon: <Star className="h-8 w-8 text-orange-600" />,
      title: "Quality Guaranteed",
      description: "We maintain the highest standards of food quality and freshness"
    }
  ];

  const stats = [
    { number: "1000+", label: "Happy Customers" },
    { number: "50+", label: "Menu Items" },
    { number: "4.8", label: "Average Rating" },
    { number: "15min", label: "Average Pickup Time" }
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/29033151/pexels-photo-29033151/free-photo-of-elegant-tokyo-restaurant-interior-with-cozy-lighting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`
          }}
        ></div>
        <div className="relative z-10 container mx-auto max-w-6xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              Welcome to <span className="text-orange-400">Savory Bites</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow">
              Experience culinary excellence with our carefully crafted dishes made from the finest ingredients
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/menu">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
                  <Utensils className="mr-2 h-5 w-5" />
                  View Menu
                </Button>
              </Link>
              <Link href="/book-table">
                <Button size="lg" variant="outline" className="bg-white/90 hover:bg-white text-gray-900 px-8 py-3 text-lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Table
                </Button>
              </Link>
              {!user && (
                <Link href="/auth/register">
                  <Button variant="outline" size="lg" className="bg-white/90 hover:bg-white text-gray-900 px-8 py-3 text-lg">
                    <Users className="mr-2 h-5 w-5" />
                    Join Us
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Savory Bites?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing an exceptional dining experience with every order
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Table Booking Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Reserve Your Perfect Table
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Book a table for an unforgettable dining experience. Choose from our interactive floor plan and secure your preferred seating.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Floor Plan</h3>
                    <p className="text-gray-600">
                      Visualize our restaurant layout and choose your preferred table location with our interactive floor plan.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Availability</h3>
                    <p className="text-gray-600">
                      Check real-time table availability and book instantly for your preferred date and time.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfect for Any Group</h3>
                    <p className="text-gray-600">
                      From intimate dinners for two to large group celebrations, we have tables for every occasion.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/book-table">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Table Now
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square bg-white rounded-2xl shadow-xl p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 opacity-50"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Restaurant Layout</h3>
                  
                  {/* Simplified floor plan preview */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600 bg-amber-200 px-3 py-1 rounded">Window Seating</div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3">
                      {/* Window tables */}
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-green-100 border-2 border-green-300 rounded-lg p-2 text-center">
                          <div className="text-xs font-medium">T{i}</div>
                          <div className="text-xs text-gray-600">2p</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 my-6">
                      {/* Center tables */}
                      {[5, 6, 7].map((i) => (
                        <div key={i} className="bg-green-100 border-2 border-green-300 rounded-lg p-3 text-center">
                          <div className="text-sm font-medium">T{i}</div>
                          <div className="text-xs text-gray-600">4p</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3 text-center">
                        <div className="text-sm font-medium">VIP</div>
                        <div className="text-xs text-gray-600">8p</div>
                      </div>
                      <div className="bg-amber-300 rounded p-2 text-xs text-center">Bar</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="text-xs text-gray-600">
                      <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></span>
                      Available Tables
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Order?
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Browse our delicious menu and place your takeaway order today
            </p>
            <Link href="/menu">
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Order Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
