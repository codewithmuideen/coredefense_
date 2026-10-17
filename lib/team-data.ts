// Team shown on /team. Original photos live in public/images/team under each person's name; the
// transparent cut-outs in /cutouts sit on a brand gradient card. Used on the team page only so no
// headshot is repeated elsewhere on the site.
export interface TeamMember {
  name: string;
  role: string;
  focus: string;
  photo: string;
  linkedin: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Innocent Paul Ojo",
    role: "Founder",
    focus: "Sets CoreDefense's direction across cybersecurity, transformation, engineering and AI.",
    photo: "/images/team/cutouts/Innocent Paul Ojo.png",
    linkedin: "https://www.linkedin.com/in/innocentpaul/",
  },
  {
    name: "Rohith Shankar",
    role: "Cybersecurity Expert",
    focus: "Shapes how we assess, harden and defend client environments.",
    photo: "/images/team/cutouts/Rohith Shankar.png",
    linkedin: "https://www.linkedin.com/in/rohith-shankar-223139350/",
  },
  {
    name: "Yogisha Paneru",
    role: "Cybersecurity Analyst",
    focus: "Turns security findings into clear, prioritised action for clients.",
    photo: "/images/team/cutouts/Yogisha Paneru.png",
    linkedin: "https://www.linkedin.com/in/yogisha-paneru-cybersecurity/",
  },
  {
    name: "Ritik R. Mohapatra",
    role: "AI Research Affiliate",
    focus: "Explores where AI can make security operations faster and smarter.",
    photo: "/images/team/cutouts/Ritik R. Mohapatra.png",
    linkedin: "https://www.linkedin.com/in/ritik-r-mohapatra/",
  },
];
