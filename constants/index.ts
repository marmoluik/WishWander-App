import onboarding1 from "@/assets/images/onboarding1.svg";
import onboarding2 from "@/assets/images/onboarding2.svg";
import onboarding3 from "@/assets/images/onboarding3.svg";
import person from "@/assets/icons/person.png";
import email from "@/assets/icons/email.png";
import lock from "@/assets/icons/lock.png";
import google from "@/assets/icons/google.png";

export const onboarding = [
    {
        id: 1,
        title: 'Plan Your Perfect Trip',
        description: 'Effortlessly create custom itineraries tailored to your style, from daily plans to must-see spots.',
        image: onboarding1
    },
    {
        id: 2,
        title: 'Discover Hidden Gems',
        description: 'Explore local favorites and unique experiences wherever you go. Your trip, curated just for you.',
        image: onboarding2
    },
    {
        id: 3,
        title: 'Stay Organized & Relax',
        description: 'Keep all your travel details in one place, so you can focus on making memories without the stress.',
        image: onboarding3
    }
]

export const icons = {
    person,
    email,
    lock,
    google
}
