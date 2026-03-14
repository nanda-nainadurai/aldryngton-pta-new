var defined = window.CMS;
var h = window.h;

// Helper: render markdown widget output as HTML
function MarkdownContent(props) {
  var content = props.content || '';
  return h('div', {
    className: 'markdown-content',
    dangerouslySetInnerHTML: { __html: content ? window.CMS.getWidgetFor && props.widgetFor ? '' : markdownToHtml(content) : '' }
  });
}

// Simple markdown to HTML (handles basic patterns)
function markdownToHtml(md) {
  if (!md) return '';
  var html = md
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, function(match) { return '<ul>' + match + '</ul>'; })
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<p>')) {
    html = '<p>' + html + '</p>';
  }
  return html;
}

// ===== HOME PAGE =====
var HomePreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var heroTitle = entry.getIn(['data', 'heroTitle']) || 'Welcome to Aldryngton PTA';
    var heroSubtitle = entry.getIn(['data', 'heroSubtitle']) || '';
    var nextMeetingDate = entry.getIn(['data', 'nextMeetingDate']) || '';

    return h('div', { className: 'preview-container' },
      h('div', { className: 'hero' },
        h('h1', {},
          'Welcome to', h('br'),
          h('span', { className: 'highlight' }, 'Aldryngton PTA')
        ),
        h('p', { className: 'subtitle' }, heroSubtitle),
        nextMeetingDate && h('div', { className: 'meeting-badge' },
          '\uD83D\uDCC5 Next Meeting: ' + nextMeetingDate
        )
      ),
      h('div', { className: 'content-section' },
        h('div', { className: 'info-box' },
          h('div', { className: 'label' }, 'Hero Title'),
          h('div', { className: 'value' }, heroTitle)
        ),
        h('div', { className: 'info-box' },
          h('div', { className: 'label' }, 'Next Meeting Date'),
          h('div', { className: 'value' }, nextMeetingDate || '(not set)')
        )
      )
    );
  }
});

// ===== PTA DETAILS =====
var PTADetailsPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var title = entry.getIn(['data', 'title']) || '';
    var intro = entry.getIn(['data', 'intro']) || '';
    var whatWeDo = entry.getIn(['data', 'whatWeDo']) || '';
    var getInvolved = entry.getIn(['data', 'getInvolved']) || '';

    return h('div', { className: 'preview-container' },
      h('div', { className: 'page-header' },
        h('h1', {}, title || 'PTA Details'),
        h('p', {}, 'A registered charity run by parent volunteers')
      ),
      h('div', { className: 'content-section' },
        h('h2', {}, 'Introduction'),
        h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(intro) } })
      ),
      h('div', { className: 'content-section white-bg' },
        h('h2', {}, 'What Does the PTA Do?'),
        h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(whatWeDo) } })
      ),
      h('div', { className: 'content-section' },
        h('h2', {}, 'Ways to Get Involved'),
        h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(getInvolved) } })
      )
    );
  }
});

// ===== CONTACT =====
var ContactPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var generalEmail = entry.getIn(['data', 'generalEmail']) || '';
    var officers = entry.getIn(['data', 'officers']);
    var eventTeams = entry.getIn(['data', 'eventTeams']);

    var officersList = officers ? officers.toJS() : [];
    var teamsList = eventTeams ? eventTeams.toJS() : [];

    var roleColors = [
      { bg: '#dcfce7', text: '#15803d' },
      { bg: '#dbeafe', text: '#1d4ed8' },
      { bg: '#dcfce7', text: '#15803d' },
      { bg: '#dbeafe', text: '#1d4ed8' }
    ];

    return h('div', { className: 'preview-container' },
      h('div', { className: 'page-header' },
        h('h1', {}, 'Contact Us'),
        h('p', {}, 'Get in touch with the Aldryngton PTA team')
      ),
      h('div', { className: 'content-section' },
        h('div', { className: 'info-box' },
          h('div', { className: 'label' }, 'General Enquiries'),
          h('div', { className: 'value', style: { color: '#16a34a' } }, generalEmail || '(not set)')
        ),

        h('h2', {}, 'PTA Officers'),
        h('div', { className: 'card-grid' },
          officersList.map(function(officer, i) {
            var colors = roleColors[i % roleColors.length];
            return h('div', { key: i, className: 'card officer-card' },
              h('div', { className: 'officer-avatar', style: { background: colors.bg } }, '\uD83D\uDC64'),
              h('span', {
                className: 'officer-role',
                style: { background: colors.bg, color: colors.text }
              }, officer.role || 'Role'),
              h('div', { className: 'officer-name' }, officer.name || 'Name'),
              h('div', { className: 'officer-email' }, officer.email || 'email')
            );
          })
        ),

        teamsList.length > 0 && h('div', { style: { marginTop: '2rem' } },
          h('h2', {}, 'Event Team Contacts'),
          h('div', { className: 'team-grid' },
            teamsList.map(function(team, i) {
              return h('div', { key: i, className: 'team-card' },
                h('div', { className: 'team-icon' }, '\u2709'),
                h('div', {},
                  h('div', { className: 'team-name' }, team.team || 'Team'),
                  h('div', { className: 'team-email' }, team.email || 'email')
                )
              );
            })
          )
        )
      )
    );
  }
});

// ===== POOL CLUB =====
var PoolClubPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var season = entry.getIn(['data', 'season']) || '';
    var applicationStatus = entry.getIn(['data', 'applicationStatus']) || '';
    var price1 = entry.getIn(['data', 'membershipOption1Price']) || '';
    var price2 = entry.getIn(['data', 'membershipOption2Price']) || '';
    var content = entry.getIn(['data', 'content']) || '';

    return h('div', { className: 'preview-container' },
      h('div', { className: 'page-header' },
        h('h1', {}, 'Pool Club'),
        h('p', {}, 'Aldryngton School Swimming Pool')
      ),
      h('div', { className: 'content-section' },
        h('div', { className: 'card-grid' },
          h('div', { className: 'card' },
            h('div', { className: 'info-box', style: { margin: 0 } },
              h('div', { className: 'label' }, 'Season'),
              h('div', { className: 'value' }, season || '(not set)')
            )
          ),
          h('div', { className: 'card' },
            h('div', { className: 'info-box', style: { margin: 0 } },
              h('div', { className: 'label' }, 'Application Status'),
              h('div', { className: 'value' },
                h('span', { className: 'badge badge-green' }, applicationStatus || '(not set)')
              )
            )
          )
        ),

        h('h2', { style: { marginTop: '2rem' } }, 'Membership Prices'),
        h('table', { className: 'price-table' },
          h('thead', {},
            h('tr', {},
              h('th', {}, 'Option'),
              h('th', {}, 'Price')
            )
          ),
          h('tbody', {},
            h('tr', {},
              h('td', {}, 'Option 1'),
              h('td', { className: 'price' }, price1 || '-')
            ),
            h('tr', {},
              h('td', {}, 'Option 2'),
              h('td', { className: 'price' }, price2 || '-')
            )
          )
        ),

        content && h('div', { style: { marginTop: '2rem' } },
          h('h2', {}, 'Additional Content'),
          h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(content) } })
        )
      )
    );
  }
});

// ===== TRY A TRI =====
var TryATriPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var nextEventDate = entry.getIn(['data', 'nextEventDate']) || '';
    var costPerChild = entry.getIn(['data', 'costPerChild']) || '';
    var content = entry.getIn(['data', 'content']) || '';

    return h('div', { className: 'preview-container' },
      h('div', { className: 'page-header' },
        h('h1', {}, 'Try a Tri'),
        h('p', {}, "Aldryngton's children's triathlon event")
      ),
      h('div', { className: 'content-section' },
        h('div', { className: 'card-grid' },
          h('div', { className: 'card' },
            h('div', { className: 'info-box', style: { margin: 0 } },
              h('div', { className: 'label' }, 'Next Event Date'),
              h('div', { className: 'value' }, nextEventDate || '(not set)')
            )
          ),
          h('div', { className: 'card' },
            h('div', { className: 'info-box', style: { margin: 0 } },
              h('div', { className: 'label' }, 'Cost Per Child'),
              h('div', { className: 'value', style: { color: '#16a34a' } }, costPerChild || '(not set)')
            )
          )
        ),

        content && h('div', { style: { marginTop: '2rem' } },
          h('h2', {}, 'Content'),
          h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(content) } })
        )
      )
    );
  }
});

// ===== SANTA'S GROTTO =====
var SantaGrottoPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var eventDate = entry.getIn(['data', 'eventDate']) || '';
    var pricePerChild = entry.getIn(['data', 'pricePerChild']) || '';
    var bookingInfo = entry.getIn(['data', 'bookingInfo']) || '';

    return h('div', { className: 'preview-container' },
      h('div', { className: 'page-header' },
        h('h1', {}, "Santa's Grotto"),
        h('p', {}, 'A magical Christmas experience for the children')
      ),
      h('div', { className: 'content-section' },
        h('div', { className: 'card-grid' },
          h('div', { className: 'card' },
            h('div', { className: 'info-box', style: { margin: 0 } },
              h('div', { className: 'label' }, 'Event Date'),
              h('div', { className: 'value' }, eventDate || '(not set)')
            )
          ),
          h('div', { className: 'card' },
            h('div', { className: 'info-box', style: { margin: 0 } },
              h('div', { className: 'label' }, 'Price Per Child'),
              h('div', { className: 'value', style: { color: '#16a34a' } }, pricePerChild || '(not set)')
            )
          )
        ),

        bookingInfo && h('div', { style: { marginTop: '2rem' } },
          h('h2', {}, 'Booking Information'),
          h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(bookingInfo) } })
        )
      )
    );
  }
});

// ===== CIRCUS =====
var CircusPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var lastEventDate = entry.getIn(['data', 'lastEventDate']) || '';
    var nextEventInfo = entry.getIn(['data', 'nextEventInfo']) || '';
    var description = entry.getIn(['data', 'description']) || '';

    return h('div', { className: 'preview-container' },
      h('div', { className: 'page-header' },
        h('h1', {}, 'Circus'),
        h('p', {}, 'A spectacular event for the whole family')
      ),
      h('div', { className: 'content-section' },
        h('div', { className: 'card-grid' },
          h('div', { className: 'card' },
            h('div', { className: 'info-box', style: { margin: 0 } },
              h('div', { className: 'label' }, 'Last Event Date'),
              h('div', { className: 'value' }, lastEventDate || '(not set)')
            )
          ),
          h('div', { className: 'card' },
            h('div', { className: 'info-box', style: { margin: 0 } },
              h('div', { className: 'label' }, 'Next Event'),
              h('div', { className: 'value' }, nextEventInfo || '(not set)')
            )
          )
        ),

        description && h('div', { style: { marginTop: '2rem' } },
          h('h2', {}, 'Description'),
          h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(description) } })
        )
      )
    );
  }
});

// ===== UNIFORM =====
var UniformPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var howToDonate = entry.getIn(['data', 'howToDonate']) || '';
    var howToBuy = entry.getIn(['data', 'howToBuy']) || '';
    var prices = entry.getIn(['data', 'prices']);
    var pricesList = prices ? prices.toJS() : [];

    return h('div', { className: 'preview-container' },
      h('div', { className: 'page-header' },
        h('h1', {}, 'Second Hand Uniform'),
        h('p', {}, 'Affordable pre-loved uniform for all year groups')
      ),
      h('div', { className: 'content-section' },
        h('h2', {}, 'How to Donate'),
        h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(howToDonate) } })
      ),
      h('div', { className: 'content-section white-bg' },
        h('h2', {}, 'How to Buy'),
        h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(howToBuy) } })
      ),
      pricesList.length > 0 && h('div', { className: 'content-section' },
        h('h2', {}, 'Prices'),
        h('table', { className: 'price-table' },
          h('thead', {},
            h('tr', {},
              h('th', {}, 'Item'),
              h('th', {}, 'Price')
            )
          ),
          h('tbody', {},
            pricesList.map(function(item, i) {
              return h('tr', { key: i },
                h('td', {}, item.item || ''),
                h('td', { className: 'price' }, item.price || '')
              );
            })
          )
        )
      )
    );
  }
});

// ===== MEETINGS =====
var MeetingsPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var nextMeetingDate = entry.getIn(['data', 'nextMeetingDate']) || '';
    var nextAGMDate = entry.getIn(['data', 'nextAGMDate']) || '';
    var content = entry.getIn(['data', 'content']) || '';

    return h('div', { className: 'preview-container' },
      h('div', { className: 'page-header' },
        h('h1', {}, 'Meetings'),
        h('p', {}, 'PTA meeting dates and information')
      ),
      h('div', { className: 'content-section' },
        h('div', { className: 'card-grid' },
          h('div', { className: 'card' },
            h('div', { className: 'info-box', style: { margin: 0 } },
              h('div', { className: 'label' }, 'Next Meeting'),
              h('div', { className: 'value' }, nextMeetingDate || '(not set)')
            )
          ),
          h('div', { className: 'card' },
            h('div', { className: 'info-box', style: { margin: 0 } },
              h('div', { className: 'label' }, 'Next AGM'),
              h('div', { className: 'value' }, nextAGMDate || '(not set)')
            )
          )
        ),

        content && h('div', { style: { marginTop: '2rem' } },
          h('h2', {}, 'Content'),
          h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(content) } })
        )
      )
    );
  }
});

// ===== FUNDRAISING =====
var FundraisingPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var calendarInfo = entry.getIn(['data', 'calendarInfo']) || '';
    var poolCampaign = entry.getIn(['data', 'poolCampaign']) || '';
    var kumonInfo = entry.getIn(['data', 'kumonInfo']) || '';
    var otherSchemes = entry.getIn(['data', 'otherSchemes']) || '';

    return h('div', { className: 'preview-container' },
      h('div', { className: 'page-header' },
        h('h1', {}, 'Fundraising'),
        h('p', {}, 'How we raise funds for our school')
      ),
      poolCampaign && h('div', { className: 'content-section' },
        h('div', { className: 'campaign-banner' },
          h('h2', {}, 'Save Our Pool'),
          h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(poolCampaign) }, style: { color: '#dbeafe' } })
        )
      ),
      calendarInfo && h('div', { className: 'content-section' },
        h('h2', {}, 'Calendar & Events'),
        h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(calendarInfo) } })
      ),
      kumonInfo && h('div', { className: 'content-section white-bg' },
        h('h2', {}, 'Kumon Partnership'),
        h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(kumonInfo) } })
      ),
      otherSchemes && h('div', { className: 'content-section' },
        h('h2', {}, 'Other Schemes'),
        h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: markdownToHtml(otherSchemes) } })
      )
    );
  }
});

// Register all preview templates
CMS.registerPreviewTemplate('home', HomePreview);
CMS.registerPreviewTemplate('pta-details', PTADetailsPreview);
CMS.registerPreviewTemplate('contact', ContactPreview);
CMS.registerPreviewTemplate('pool-club', PoolClubPreview);
CMS.registerPreviewTemplate('try-a-tri', TryATriPreview);
CMS.registerPreviewTemplate('santas-grotto', SantaGrottoPreview);
CMS.registerPreviewTemplate('circus', CircusPreview);
CMS.registerPreviewTemplate('uniform', UniformPreview);
CMS.registerPreviewTemplate('meetings-info', MeetingsPreview);
CMS.registerPreviewTemplate('fundraising-main', FundraisingPreview);

// Register preview styles
CMS.registerPreviewStyle('/aldryngton-pta-new/admin/preview-styles.css');
