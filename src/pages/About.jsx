import { Leaf, Heart, Globe, Users, Target, Sparkles } from "lucide-react";
import EcoCard from "@/components/ui/EcoCard";

const About = () => {
  const values = [
    {
      icon: Leaf,
      title: "Sustainability First",
      description:
        "Every lesson, quiz, and task is designed to promote environmental awareness and sustainable living.",
    },
    {
      icon: Heart,
      title: "Gamified Learning",
      description:
        "Earn XP, maintain streaks, and level up while building eco-friendly habits that stick.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description:
        "Join thousands of learners worldwide making a positive impact on our planet.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Connect with like-minded individuals passionate about creating a greener future.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Learners" },
    { value: "50+", label: "Eco Courses" },
    { value: "100K+", label: "Tasks Completed" },
    { value: "5M kg", label: "CO₂ Tracked" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary">
          <Leaf className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">About EcoBoard</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          EcoBoard is a gamified learning platform that makes environmental education
          engaging, rewarding, and impactful. Learn, grow, and make a difference.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <EcoCard key={stat.label} className="text-center" hover={false}>
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </EcoCard>
        ))}
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-foreground">Our Values</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((value) => (
            <EcoCard key={value.title} className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-eco-mint">
                <value.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{value.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{value.description}</p>
              </div>
            </EcoCard>
          ))}
        </div>
      </div>

      {/* Mission */}
      <EcoCard className="text-center" hover={false}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-eco-mint">
          <Target className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          To empower the next generation of environmental stewards through engaging,
          gamified education. We believe that small daily actions, when multiplied by
          millions of people, can transform the world. EcoBoard makes sustainable living
          fun, trackable, and rewarding.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="font-medium">Start your eco-journey today</span>
          <Sparkles className="h-5 w-5" />
        </div>
      </EcoCard>
    </div>
  );
};

export default About;
