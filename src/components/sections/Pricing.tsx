import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 49,
    originalPrice: 99,
    duration: 'month',
    description: 'Perfect for beginners starting their AI journey',
    features: [
      'Access to first 3 modules',
      'Basic community access',
      '20+ hands-on projects',
      'Email support',
      'Mobile app access',
      'Progress tracking'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: 149,
    originalPrice: 299,
    duration: 'lifetime',
    description: 'Complete AI mastery with lifetime access',
    features: [
      'All 6 modules (23 weeks)',
      'Premium community access',
      '50+ hands-on projects',
      '1-on-1 mentorship sessions',
      'Career placement assistance',
      'Industry certification',
      'Lifetime updates',
      'Priority support'
    ],
    popular: true
  },
  {
    name: 'Team',
    price: 499,
    originalPrice: 999,
    duration: 'for 5 seats',
    description: 'Perfect for teams and organizations',
    features: [
      'Everything in Professional',
      'Team dashboard & analytics',
      'Custom learning paths',
      'Dedicated account manager',
      'Team collaboration tools',
      'Bulk certificates',
      'Custom integrations',
      'On-site workshops available'
    ],
    popular: false
  }
];

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'lifetime'>('lifetime');

  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Invest in Your AI Future
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Choose the plan that fits your learning goals. All plans include our 30-day money-back guarantee.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 border border-neutral-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('lifetime')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'lifetime'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Lifetime
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Save 50%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-8 ${
                plan.popular
                  ? 'ring-2 ring-primary-500 shadow-xl scale-105'
                  : 'hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-neutral-600 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-neutral-900">
                    ${plan.price}
                  </span>
                  <div className="text-left">
                    <div className="text-sm text-neutral-500 line-through">
                      ${plan.originalPrice}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {plan.duration}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Save ${plan.originalPrice - plan.price}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className="w-full"
                size="lg"
              >
                {plan.name === 'Team' ? 'Contact Sales' : 'Get Started'}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-neutral-600 mb-4">
            🔒 30-day money-back guarantee • 💳 Secure payment • 🎓 Instant access
          </p>
          <p className="text-sm text-neutral-500">
            Questions? <a href="#" className="text-primary-600 hover:underline">Contact our team</a> or check our <a href="#" className="text-primary-600 hover:underline">FAQ</a>
          </p>
        </div>
      </div>
    </section>
  );
};