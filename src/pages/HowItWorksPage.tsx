import React from 'react';
import Navigation from '../components/Navigation';
import { Brain, Target, TrendingUp, Zap, BarChart3, CheckCircle, Database, Cpu } from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            How Our <span className="text-red-primary">AI Prediction</span> System Works
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Our advanced machine learning algorithms analyze hundreds of data points to deliver 
            the most accurate UFC fight predictions with 89.7% accuracy.
          </p>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-16">Our Prediction Process</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-bg-near-black border border-border-moderate rounded-xl p-6 mb-4">
                <Database className="h-12 w-12 text-red-primary mx-auto mb-4" />
                <div className="bg-red-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
                <p className="text-text-secondary text-sm">
                  We gather fighter statistics, fight history, training data, and performance metrics from multiple sources.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-bg-near-black border border-border-moderate rounded-xl p-6 mb-4">
                <Cpu className="h-12 w-12 text-red-primary mx-auto mb-4" />
                <div className="bg-red-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-text-secondary text-sm">
                  Our neural networks process the data using advanced algorithms including pattern recognition and trend analysis.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-bg-near-black border border-border-moderate rounded-xl p-6 mb-4">
                <Brain className="h-12 w-12 text-red-primary mx-auto mb-4" />
                <div className="bg-red-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Machine Learning</h3>
                <p className="text-text-secondary text-sm">
                  The system continuously learns from past results, improving accuracy with every fight prediction.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-bg-near-black border border-border-moderate rounded-xl p-6 mb-4">
                <Target className="h-12 w-12 text-red-primary mx-auto mb-4" />
                <div className="bg-red-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-2">Final Prediction</h3>
                <p className="text-text-secondary text-sm">
                  Generate comprehensive predictions with confidence scores and probability breakdowns for each fighter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-16">What Makes Our AI Superior</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-bg-pure-black border border-border-moderate rounded-xl p-8">
              <TrendingUp className="h-10 w-10 text-red-primary mb-4" />
              <h3 className="text-xl font-semibold mb-4">Real-Time Updates</h3>
              <p className="text-text-secondary mb-4">
                Our system continuously monitors fighter condition, training updates, and market changes to adjust predictions in real-time.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-red-primary mr-2" />
                  Training camp status
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-red-primary mr-2" />
                  Injury reports
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-red-primary mr-2" />
                  Weight cut progress
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-bg-pure-black border border-border-moderate rounded-xl p-8">
              <BarChart3 className="h-10 w-10 text-red-primary mb-4" />
              <h3 className="text-xl font-semibold mb-4">Deep Analytics</h3>
              <p className="text-text-secondary mb-4">
                We analyze 150+ factors including striking accuracy, takedown defense, cardio patterns, and psychological factors.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-red-primary mr-2" />
                  Striking metrics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-red-primary mr-2" />
                  Grappling statistics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-red-primary mr-2" />
                  Fight IQ indicators
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-bg-pure-black border border-border-moderate rounded-xl p-8">
              <Zap className="h-10 w-10 text-red-primary mb-4" />
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-text-secondary mb-4">
                Get predictions within seconds of fight announcements, giving you the earliest advantage in the betting markets.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-red-primary mr-2" />
                  Instant analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-red-primary mr-2" />
                  Live odds integration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-red-primary mr-2" />
                  Mobile notifications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-16">Our Data Sources</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-red-primary">Fighter Data</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-red-primary mt-1" />
                  <div>
                    <p className="font-medium">Fight History</p>
                    <p className="text-text-secondary text-sm">Complete record of all UFC fights, opponents, and outcomes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-red-primary mt-1" />
                  <div>
                    <p className="font-medium">Physical Attributes</p>
                    <p className="text-text-secondary text-sm">Height, reach, stance, age, weight class evolution</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-red-primary mt-1" />
                  <div>
                    <p className="font-medium">Training Camp Info</p>
                    <p className="text-text-secondary text-sm">Gym affiliations, coaching teams, sparring partners</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-red-primary mt-1" />
                  <div>
                    <p className="font-medium">Performance Metrics</p>
                    <p className="text-text-secondary text-sm">Striking accuracy, takedown defense, submission attempts</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6 text-red-primary">Advanced Analytics</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-red-primary mt-1" />
                  <div>
                    <p className="font-medium">Fight IQ Analysis</p>
                    <p className="text-text-secondary text-sm">Decision-making patterns, adaptive strategies, momentum shifts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-red-primary mt-1" />
                  <div>
                    <p className="font-medium">Psychological Factors</p>
                    <p className="text-text-secondary text-sm">Pressure handling, comeback ability, championship experience</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-red-primary mt-1" />
                  <div>
                    <p className="font-medium">Physical Condition</p>
                    <p className="text-text-secondary text-sm">Cardio patterns, durability, injury history, age factors</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-red-primary mt-1" />
                  <div>
                    <p className="font-medium">Style Matchups</p>
                    <p className="text-text-secondary text-sm">Fighting style compatibility, historical matchup data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accuracy Metrics */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-8">Proven Accuracy Track Record</h2>
          <p className="text-xl text-text-secondary mb-12">
            Our AI system has achieved industry-leading accuracy through continuous learning and data refinement.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-bg-pure-black border border-border-moderate rounded-xl p-8">
              <div className="text-4xl font-bold text-red-primary mb-2">89.7%</div>
              <p className="text-lg font-medium mb-2">Overall Accuracy</p>
              <p className="text-text-secondary text-sm">Correct predictions across all fight outcomes</p>
            </div>
            
            <div className="bg-bg-pure-black border border-border-moderate rounded-xl p-8">
              <div className="text-4xl font-bold text-red-primary mb-2">94.2%</div>
              <p className="text-lg font-medium mb-2">Method Accuracy</p>
              <p className="text-text-secondary text-sm">Correct prediction of fight finish method</p>
            </div>
            
            <div className="bg-bg-pure-black border border-border-moderate rounded-xl p-8">
              <div className="text-4xl font-bold text-red-primary mb-2">2,847</div>
              <p className="text-lg font-medium mb-2">Fights Analyzed</p>
              <p className="text-text-secondary text-sm">Total dataset powering our predictions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6">Ready to Use Our AI Predictions?</h2>
          <p className="text-xl text-text-secondary mb-8">
            Join thousands of bettors who rely on our AI for accurate UFC fight predictions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-3 text-lg">
              Start Predicting
            </button>
            <button className="btn-secondary px-8 py-3 text-lg">
              View Live Odds
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;