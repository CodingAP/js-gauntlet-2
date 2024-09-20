import Database from 'better-sqlite3';

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS TICKETS (
        TICKET_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        TICKET_SUMMARY TEXT NOT NULL,
        TICKET_DESCRIPTION TEXT NOT NULL,
        TICKET_AUTHOR TEXT NOT NULL,
        TICKET_DATE TEXT NOT NULL,
        TICKET_COMPLETE INTEGER NOT NULL
    );
`;

const authors = ['Sven', 'Justin', 'John', 'Stanley', 'Alfred'];
const getRandomDate = (start, end) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const randomDate = new Date(startDate + Math.random() * (endDate - startDate));
    return randomDate.toISOString().split('T')[0]; // Return the date in 'YYYY-MM-DD' format
}

const summaries = {
    summaries: [
        "Network latency in office network",
        "Unable to connect to VPN",
        "Emails not syncing on Outlook",
        "Slow performance on file server",
        "Printer not responding on floor 2",
        "Password reset request",
        "System outage in data center",
        "Firewall misconfiguration detected",
        "Application crash on startup",
        "Database backup failure",
        "Software installation request",
        "Permission denied error on shared drive",
        "Hardware upgrade request for workstations",
        "Router reboot required for connectivity",
        "Security audit report overdue",
        "Antivirus update failing",
        "Hard drive failure on server",
        "OS update required on legacy machines",
        "Mobile device management issue",
        "Disk space running low on server",
        "Active Directory replication failure",
        "Wi-Fi disconnecting intermittently",
        "Application license expired",
        "User unable to log in",
        "Malware detected on client machine",
        "Patch deployment failed",
        "Unable to access internal portal",
        "Cloud storage synchronization issue",
        "SSL certificate expired",
        "Workstation freezing randomly",
        "Monitor not displaying correctly",
        "Phone system outage",
        "Backup restoration request",
        "Database query running slowly",
        "Software crash during high load",
        "Email phishing attempt reported",
        "Group policy not applying correctly",
        "Two-factor authentication setup",
        "System audit request for compliance",
        "User account locked out",
        "Hard drive nearing capacity",
        "Data leak investigation",
        "Helpdesk tool not loading",
        "Ticketing system performance issues",
        "Server rack overheating alert",
        "File corruption on shared drive",
        "VoIP system experiencing delays",
        "Database migration request",
        "User onboarding automation",
        "File permissions misconfigured",
        "Service downtime notification",
        "Cloud server unreachable",
        "Old server decommissioning",
        "Password policy update",
        "Database schema change",
        "Workstation virus infection",
        "VPN authentication issues",
        "Server patching scheduled",
        "Firewall rules misconfigured",
        "Incident response plan triggered",
        "Login script errors reported",
        "Printer configuration issue",
        "SSL decryption failure",
        "High CPU usage on server",
        "Email delivery failure",
        "Wi-Fi network capacity issues",
        "Network drive mapping issues",
        "Data recovery request",
        "Storage array reconfiguration",
        "Login credentials compromised",
        "Service access request",
        "Windows activation problem",
        "Patch management misconfigured",
        "Phone system misrouted calls",
        "External drive encryption",
        "Unscheduled server reboot",
        "Firmware update on router",
        "Software license renewal",
        "Server crash under load",
        "End-user training on new software",
        "File not syncing across devices",
        "OS reinstallation required",
        "Network switch upgrade request",
        "Service degradation report",
        "Spam filter bypass issue",
        "Windows profile corruption",
        "Multifactor authentication bypass",
        "User profile migration request",
        "Server not booting",
        "Critical application downtime",
        "IT asset inventory request",
        "Data retention policy update",
        "High memory usage alert",
        "Desktop power supply failure",
        "Outlook plugin not working",
        "Domain controller performance",
        "Switch port configuration change",
        "Internal system compromise suspected",
        "Password sync issues across platforms",
        "Network cable reconfiguration",
        "SharePoint permission issues",
        "IT governance policy change",
        "Remote desktop not connecting"
    ],
    descriptions: [
        "The office network is experiencing significant latency affecting all users.",
        "User reports inability to connect to the company VPN for remote access.",
        "Outlook client is not syncing emails across devices for multiple users.",
        "File server performance is slow when accessing or saving files.",
        "The printer on floor 2 is unresponsive and not receiving any print jobs.",
        "User has forgotten their password and requires a reset.",
        "A system-wide outage is affecting the main data center, causing downtime.",
        "Detected a misconfiguration in the firewall that is blocking necessary traffic.",
        "An application crashes immediately upon startup, affecting user productivity.",
        "The scheduled database backup failed due to insufficient disk space.",
        "User requests installation of new software to improve workflow.",
        "User is unable to access shared drive files due to permission errors.",
        "Request for hardware upgrades on outdated workstations in the office.",
        "The router requires a reboot to restore connectivity to several departments.",
        "Security audit report for Q2 is overdue and needs to be generated.",
        "Antivirus software is failing to update its virus definitions.",
        "Hard drive in server has failed and is causing downtime for users.",
        "OS updates are overdue on older machines and need to be applied.",
        "Mobile device management is not properly pushing policies to company phones.",
        "Disk space on server is critically low and needs immediate attention.",
        "Active Directory replication between sites has failed and needs troubleshooting.",
        "Wi-Fi connection drops intermittently for users in the west wing.",
        "An application’s license has expired and needs renewal to continue operations.",
        "User is unable to log into their account despite correct credentials.",
        "Malware was detected on a user machine and requires immediate remediation.",
        "Patch deployment to the production environment has failed.",
        "User cannot access the internal company portal after recent updates.",
        "Cloud storage is failing to sync data between multiple devices.",
        "The SSL certificate for a web service has expired and needs renewal.",
        "Workstation freezes randomly during use, causing loss of productivity.",
        "Monitor is not displaying properly; screen flickers and goes black.",
        "The phone system is down across multiple departments.",
        "User requests restoration of files from a previous backup.",
        "A specific database query is running much slower than expected.",
        "The application crashes under heavy load, affecting performance.",
        "A phishing attempt was reported by a user, and investigation is required.",
        "Group policy settings are not applying correctly on user workstations.",
        "User requests assistance in setting up two-factor authentication.",
        "A system audit for compliance purposes has been requested by management.",
        "User account is locked out due to too many failed login attempts.",
        "Hard drive is nearing its capacity limit, and files cannot be saved.",
        "An investigation into a potential data leak is needed for compliance.",
        "Helpdesk tool fails to load, preventing ticket management by staff.",
        "Ticketing system is experiencing performance issues and is slow to respond.",
        "Server rack temperature exceeds acceptable limits, triggering an alert.",
        "Corrupted files detected on the shared drive, affecting team collaboration.",
        "VoIP system is experiencing delays and poor call quality across sites.",
        "Request to migrate a database to a new server.",
        "Automation for user onboarding is not functioning as expected.",
        "Misconfigured file permissions are preventing access to important documents.",
        "Notification about planned service downtime for system maintenance.",
        "Cloud server is unreachable, preventing access to hosted services.",
        "Old server is scheduled for decommissioning, and data needs to be migrated.",
        "A password policy update has been requested to meet new security standards.",
        "A change in database schema is required for a new application feature.",
        "Virus detected on a user’s workstation, and cleanup is necessary.",
        "VPN authentication fails when attempting remote login.",
        "Server patching has been scheduled for after-hours maintenance.",
        "Firewall rules are misconfigured, blocking essential traffic.",
        "Incident response plan has been triggered due to a security breach.",
        "Errors reported in the login script, affecting user authentication.",
        "The printer configuration is incorrect, preventing users from printing.",
        "SSL decryption is failing, preventing secure communication.",
        "High CPU usage has been detected on the server, affecting performance.",
        "Email delivery is failing for multiple users, requiring investigation.",
        "Wi-Fi network is overloaded due to high user demand.",
        "Network drives are not mapping correctly for users upon login.",
        "User requests data recovery from a damaged hard drive.",
        "Reconfiguration of the storage array is required for optimal performance.",
        "User’s login credentials appear to have been compromised.",
        "User requests access to a restricted service for project work.",
        "Windows activation is failing on several workstations, preventing updates.",
        "Patch management software is misconfigured and not deploying updates.",
        "Phone system is routing calls incorrectly for multiple users.",
        "User requests encryption of an external hard drive for security compliance.",
        "Server rebooted unexpectedly during production hours.",
        "Firmware update required for the router after performance issues were reported.",
        "A software license needs to be renewed for continued use.",
        "Server crashed under heavy load, affecting services.",
        "End-users need training on new software recently rolled out.",
        "Files are not syncing across multiple devices, causing delays in work.",
        "Operating system needs to be reinstalled on a corrupted machine.",
        "Request to upgrade network switch to support higher throughput.",
        "Report of degraded performance on a critical service.",
        "Spam filter was bypassed by multiple malicious emails.",
        "Windows user profile is corrupted, preventing login.",
        "User was able to bypass multifactor authentication during login.",
        "User requests migration of their profile to a new workstation.",
        "A server is not booting properly after an update.",
        "Critical downtime reported on a key business application.",
        "Request for inventory of all IT assets for compliance.",
        "Data retention policy needs to be updated to meet new regulations.",
        "High memory usage has been detected on the server.",
        "Desktop power supply has failed, and replacement is required.",
        "Outlook plugin is not functioning, affecting email synchronization.",
        "Performance issues detected with the domain controller.",
        "Request to change switch port configuration for new devices.",
        "Internal system may have been compromised by an external threat.",
        "User reports password sync issues across multiple platforms.",
        "Network cables need to be reconfigured to reduce latency.",
        "Permission issues on SharePoint are preventing collaboration.",
        "Changes required to the IT governance policy for compliance.",
        "Remote desktop service is not connecting for users working remotely."
    ]
}

const generateID = () => {
    const CHARS = 'abcdefghijklmnopqurstuvwxyz0123456789';
    return new Array(16).fill(0).map((_) => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
}

class UserManager {
    constructor() {
        this.users = {};
    }

    createUser() {
        const id = generateID();
        this.users[id] = {
            stage: 1,
            data: {}
        }
        return id;
    }

    getUser(id) {
        return this.users[id];
    }

    nextStage(id) {
        this.users[id].stage++;
        if (this.users[id].stage > 8) this.users[id].stage = 8;

        console.log(this.users);
    }

    createDatabase(id) {
        const db = new Database(`data/${id}.db`);
        db.pragma('journal_mode = WAL');

        db.exec(createTableQuery);

        const insertTicket = db.prepare(`
            INSERT INTO TICKETS (TICKET_SUMMARY, TICKET_DESCRIPTION, TICKET_AUTHOR, TICKET_DATE, TICKET_COMPLETE) 
            VALUES (?, ?, ?, ?, ?)
        `);

        const randomEntry = Math.floor(Math.random() * 100);
        for (let i = 0; i < 100; i++) {
            const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
            const randomDate = getRandomDate('2023-01-01', '2024-10-25');

            if (i == randomEntry) {
                insertTicket.run(summaries.summaries[i], summaries.descriptions[i], 'Stanley', '2024-10-25', 0);
            } else {
                insertTicket.run(summaries.summaries[i], summaries.descriptions[i], randomAuthor, randomDate, 1);
            }
        }

        db.close();

        this.getUser(id).data.stage6 = true;
    }

    insertTicket(id, data) {
        const db = new Database(`data/${id}.db`);
        db.pragma('journal_mode = WAL');

        db.exec(`
            INSERT INTO TICKETS (TICKET_AUTHOR, TICKET_DATE, TICKET_COMPLETE, TICKET_SUMMARY, TICKET_DESCRIPTION)
            VALUES ('R3n3gad3s Team', '${new Date().toISOString().split('T')[0]}', 0, '${data.summary}', '${data.description}')
        `);

        db.close();
    }

    getAllTickets(id) {
        const db = new Database(`data/${id}.db`);
        db.pragma('journal_mode = WAL');

        const tickets = db.prepare('SELECT * FROM TICKETS').all();

        db.close();

        return tickets;
    }
}

const userManager = new UserManager();

export default userManager;