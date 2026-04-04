const sections = {
  events: [
    {
      title: 'Earth Day 2026 (April 22, 2026)',
      blurb:
        'Join climate and environmental action campaigns, local cleanups, and community activities through Earth Day’s official network.',
      link: 'https://www.earthday.org/',
      source: 'EARTHDAY.ORG',
    },
    {
      title: 'Good Deeds Day (April 5, 2026)',
      blurb:
        'A global day of service with projects that support both people and neighborhoods. Great for families, students, and teams.',
      link: 'https://www.pointsoflight.org/good-deeds-day/',
      source: 'Points of Light',
    },
    {
      title: 'National Volunteer Week (April 19–25, 2026)',
      blurb:
        'Celebrate and join volunteer opportunities across the U.S. through one of the most established service campaigns.',
      link: 'https://www.pointsoflight.org/nvw/',
      source: 'Points of Light',
    },
  ],
  orgs: [
    {
      title: 'National Park Service (NPS)',
      blurb:
        'A U.S. government agency with conservation, restoration, and visitor support opportunities in parks nationwide.',
      link: 'https://www.nps.gov/getinvolved/volunteer.htm',
      source: 'nps.gov',
    },
    {
      title: 'Arbor Day Foundation',
      blurb:
        'Focused on tree planting, urban forestry, and practical ways communities can cool neighborhoods and improve air quality.',
      link: 'https://www.arborday.org/',
      source: 'Arbor Day Foundation',
    },
    {
      title: 'Keep America Beautiful',
      blurb:
        'Community cleanups, recycling education, and beautification projects with local affiliates around the country.',
      link: 'https://kab.org/',
      source: 'Keep America Beautiful',
    },
  ],
  volunteer: [
    {
      title: 'VolunteerMatch (Environment Filter)',
      blurb:
        'Search current volunteer listings by ZIP code and cause area, including climate, parks, and neighborhood cleanups.',
      link: 'https://www.volunteermatch.org/',
      source: 'VolunteerMatch',
    },
    {
      title: 'Habitat for Humanity',
      blurb:
        'Hands-on local volunteering helping families build or improve affordable housing in your area.',
      link: 'https://www.habitat.org/volunteer',
      source: 'Habitat for Humanity',
    },
    {
      title: 'NPS + Volunteer.gov Opportunities',
      blurb:
        'Find official federal volunteer postings including trail work, habitat support, and visitor education.',
      link: 'https://www.volunteer.gov/s/',
      source: 'Volunteer.gov',
    },
  ],
};

function renderCards(sectionId, items) {
  const container = document.getElementById(sectionId);
  container.innerHTML = items
    .map(
      (item) => `
      <article class="live-card">
        <h3>${item.title}</h3>
        <p>${item.blurb}</p>
        <p class="meta">Source: <strong>${item.source}</strong></p>
        <a href="${item.link}" target="_blank" rel="noopener noreferrer">Open official site ↗</a>
      </article>
    `
    )
    .join('');
}

renderCards('events', sections.events);
renderCards('orgs', sections.orgs);
renderCards('volunteer', sections.volunteer);
