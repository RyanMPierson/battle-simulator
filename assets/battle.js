// Army presets with real-world examples (all baseSize 500, more stats, more armies)
const ARMY_PRESETS = [
    { name: "SAS (UK)", training: 10, weaponry: 9, morale: 9, tactics: 10, logistics: 8, tech: 9, experience: 9, leadership: 10, terrain: 8, homeAdvantage: 1, baseSize: 500 },
    { name: "US Marines", training: 8, weaponry: 8, morale: 8, tactics: 8, logistics: 9, tech: 8, experience: 8, leadership: 8, terrain: 7, homeAdvantage: 1, baseSize: 500 },
    { name: "WW2 Germany", training: 7, weaponry: 7, morale: 7, tactics: 8, logistics: 7, tech: 7, experience: 7, leadership: 8, terrain: 6, homeAdvantage: 1, baseSize: 500 },
    { name: "Soviet Union (WW2)", training: 6, weaponry: 6, morale: 8, tactics: 6, logistics: 6, tech: 6, experience: 7, leadership: 7, terrain: 7, homeAdvantage: 1, baseSize: 500 },
    { name: "Vietnam Vietcong", training: 6, weaponry: 5, morale: 9, tactics: 8, logistics: 7, tech: 5, experience: 8, leadership: 7, terrain: 10, homeAdvantage: 2, baseSize: 500 },
    { name: "Samurai", training: 8, weaponry: 6, morale: 8, tactics: 7, logistics: 5, tech: 5, experience: 8, leadership: 8, terrain: 7, homeAdvantage: 1, baseSize: 500 },
    { name: "Ninjas", training: 9, weaponry: 5, morale: 7, tactics: 10, logistics: 4, tech: 5, experience: 8, leadership: 7, terrain: 10, homeAdvantage: 2, baseSize: 500 },
    { name: "Roman Legion", training: 8, weaponry: 7, morale: 8, tactics: 9, logistics: 9, tech: 6, experience: 8, leadership: 9, terrain: 7, homeAdvantage: 1, baseSize: 500 },
    { name: "Mongol Horde", training: 7, weaponry: 7, morale: 9, tactics: 9, logistics: 10, tech: 7, experience: 9, leadership: 10, terrain: 9, homeAdvantage: 1, baseSize: 500 },
    { name: "Napoleonic French", training: 8, weaponry: 7, morale: 9, tactics: 9, logistics: 8, tech: 7, experience: 8, leadership: 10, terrain: 7, homeAdvantage: 1, baseSize: 500 },
    { name: "Spartan Hoplites", training: 10, weaponry: 8, morale: 10, tactics: 8, logistics: 6, tech: 6, experience: 9, leadership: 9, terrain: 7, homeAdvantage: 1, baseSize: 500 },
    { name: "Ottoman Janissaries", training: 8, weaponry: 7, morale: 8, tactics: 8, logistics: 8, tech: 7, experience: 8, leadership: 8, terrain: 7, homeAdvantage: 1, baseSize: 500 },
    { name: "Modern PLA (China)", training: 7, weaponry: 8, morale: 8, tactics: 7, logistics: 8, tech: 9, experience: 7, leadership: 7, terrain: 7, homeAdvantage: 1, baseSize: 500 },
    { name: "IDF (Israel)", training: 9, weaponry: 9, morale: 9, tactics: 9, logistics: 8, tech: 9, experience: 8, leadership: 9, terrain: 8, homeAdvantage: 1, baseSize: 500 },
    { name: "French Foreign Legion", training: 8, weaponry: 8, morale: 9, tactics: 8, logistics: 7, tech: 8, experience: 9, leadership: 8, terrain: 8, homeAdvantage: 1, baseSize: 500 },
    { name: "Zulu Warriors", training: 6, weaponry: 5, morale: 10, tactics: 8, logistics: 6, tech: 4, experience: 8, leadership: 9, terrain: 9, homeAdvantage: 2, baseSize: 500 },
    { name: "US Army (Modern)", training: 8, weaponry: 9, morale: 8, tactics: 8, logistics: 9, tech: 10, experience: 8, leadership: 8, terrain: 8, homeAdvantage: 1, baseSize: 500 },
    { name: "Russian Army (Modern)", training: 7, weaponry: 8, morale: 7, tactics: 7, logistics: 7, tech: 8, experience: 7, leadership: 7, terrain: 7, homeAdvantage: 1, baseSize: 500 },
    { name: "WW2 US Army", training: 7, weaponry: 8, morale: 8, tactics: 7, logistics: 8, tech: 7, experience: 7, leadership: 8, terrain: 7, homeAdvantage: 1, baseSize: 500 },
    { name: "WW2 British Army", training: 7, weaponry: 7, morale: 8, tactics: 7, logistics: 8, tech: 7, experience: 7, leadership: 8, terrain: 7, homeAdvantage: 1, baseSize: 500 }
];

function createArmyConfig(index, preset = null) {
    const div = document.createElement('div');
    div.className = 'army-config';
    
    // Find the preset index if preset is provided
    const presetIndex = preset ? ARMY_PRESETS.findIndex(p => p.name === preset.name) : -1;
    
    div.innerHTML = `
        <label>Preset
            <select class="preset-select">
                <option value="">Custom</option>
                ${ARMY_PRESETS.map((a, i) => `<option value="${i}" ${presetIndex === i ? 'selected' : ''}>${a.name}</option>`).join('')}
            </select>
        </label>
        <label>Name <input type="text" class="army-name" value="${preset ? preset.name : ''}" required></label>
        <label>Size <input type="number" class="army-size" value="${preset ? preset.baseSize : 500}" min="1"></label>
        <label>Training (1-10) <input type="number" class="army-training" value="${preset ? preset.training : 5}" min="1" max="10"></label>
        <label>Weaponry (1-10) <input type="number" class="army-weaponry" value="${preset ? preset.weaponry : 5}" min="1" max="10"></label>
        <label>Morale (1-10) <input type="number" class="army-morale" value="${preset ? preset.morale : 5}" min="1" max="10"></label>
        <label>Tactics (1-10) <input type="number" class="army-tactics" value="${preset ? preset.tactics : 5}" min="1" max="10"></label>
        <label>Logistics (1-10) <input type="number" class="army-logistics" value="${preset ? preset.logistics : 5}" min="1" max="10"></label>
        <label>Tech (1-10) <input type="number" class="army-tech" value="${preset ? preset.tech : 5}" min="1" max="10"></label>
        <label>Experience (1-10) <input type="number" class="army-experience" value="${preset ? preset.experience : 5}" min="1" max="10"></label>
        <label>Leadership (1-10) <input type="number" class="army-leadership" value="${preset ? preset.leadership : 5}" min="1" max="10"></label>
        <label>Terrain Adaptation (1-10) <input type="number" class="army-terrain" value="${preset ? preset.terrain : 5}" min="1" max="10"></label>
        <label>Home Advantage
            <select class="army-home">
                <option value="0">None</option>
                <option value="1" ${preset && preset.homeAdvantage === 1 ? 'selected' : ''}>Home</option>
                <option value="2" ${preset && preset.homeAdvantage === 2 ? 'selected' : ''}>Strong Home</option>
            </select>
        </label>
        <label>Visitor Disadvantage
            <select class="army-visitor">
                <option value="0">None</option>
                <option value="1">Visitor</option>
                <option value="2">Strong Visitor</option>
            </select>
        </label>
        <label>Count <input type="number" class="army-count" value="1" min="1"></label>
        <button type="button" class="remove-army">Remove</button>
    `;

    // Attach preset select logic to update fields in place
    setTimeout(() => {
        const presetSelect = div.querySelector('.preset-select');
        presetSelect.addEventListener('change', e => {
            if (presetSelect.value) {
                const presetArmy = ARMY_PRESETS[parseInt(presetSelect.value)];
                div.querySelector('.army-name').value = presetArmy.name;
                div.querySelector('.army-size').value = presetArmy.baseSize;
                div.querySelector('.army-training').value = presetArmy.training;
                div.querySelector('.army-weaponry').value = presetArmy.weaponry;
                div.querySelector('.army-morale').value = presetArmy.morale;
                div.querySelector('.army-tactics').value = presetArmy.tactics;
                div.querySelector('.army-logistics').value = presetArmy.logistics;
                div.querySelector('.army-tech').value = presetArmy.tech;
                div.querySelector('.army-experience').value = presetArmy.experience;
                div.querySelector('.army-leadership').value = presetArmy.leadership;
                div.querySelector('.army-terrain').value = presetArmy.terrain;
                div.querySelector('.army-home').value = presetArmy.homeAdvantage;
                // visitor stays as user set
            }
        });
    }, 0);
    return div;
}

function getArmyConfigs() {
    const configs = [];
    document.querySelectorAll('.army-config').forEach(div => {
        configs.push({
            name: div.querySelector('.army-name').value,
            size: parseInt(div.querySelector('.army-size').value),
            training: parseInt(div.querySelector('.army-training').value),
            weaponry: parseInt(div.querySelector('.army-weaponry').value),
            morale: parseInt(div.querySelector('.army-morale').value),
            tactics: parseInt(div.querySelector('.army-tactics').value),
            logistics: parseInt(div.querySelector('.army-logistics').value),
            tech: parseInt(div.querySelector('.army-tech').value),
            experience: parseInt(div.querySelector('.army-experience').value),
            leadership: parseInt(div.querySelector('.army-leadership').value),
            terrain: parseInt(div.querySelector('.army-terrain').value),
            home: parseInt(div.querySelector('.army-home').value),
            visitor: parseInt(div.querySelector('.army-visitor').value),
            count: parseInt(div.querySelector('.army-count').value)
        });
    });
    return configs;
}

function calculateArmyPower(army) {
    // Weighted sum, with some randomness
    let base = army.size * (
        0.2 +
        0.05 * army.training +
        0.05 * army.weaponry +
        0.05 * army.morale +
        0.05 * army.tactics +
        0.05 * army.logistics +
        0.05 * army.tech +
        0.05 * army.experience +
        0.05 * army.leadership +
        0.05 * army.terrain
    );
    base *= (1 + 0.1 * army.home - 0.1 * army.visitor);
    // Add some luck (variance)
    const luck = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
    return base * luck;
}

function runSimulation(armies) {
    // armies: [{name, size, training, weaponry, morale, home, visitor, count}]
    // Expand armies by count
    let expanded = [];
    armies.forEach(army => {
        for (let i = 0; i < army.count; i++) {
            expanded.push({...army});
        }
    });
    // Calculate power for each
    let results = expanded.map(army => ({
        name: army.name,
        power: calculateArmyPower(army)
    }));
    // Find winner(s)
    let maxPower = Math.max(...results.map(r => r.power));
    let winners = results.filter(r => r.power === maxPower);
    return {
        results,
        winners
    };
}

function summarizeArmy(army) {
    return `${army.name} (Size: ${army.size}, Training: ${army.training}, Weaponry: ${army.weaponry}, Morale: ${army.morale}, Tactics: ${army.tactics}, Logistics: ${army.logistics}, Tech: ${army.tech}, Experience: ${army.experience}, Leadership: ${army.leadership}, Terrain: ${army.terrain}, Home: ${army.home}, Visitor: ${army.visitor}) x${army.count}`;
}

function showResults(simResults, armies) {
    const resultsDiv = document.getElementById('results');
    let summary = armies.map(summarizeArmy).join('<br>');
    let winCounts = {};
    let statSums = {};
    let statWinSums = {};
    let statNames = ['training', 'weaponry', 'morale', 'tactics', 'logistics', 'tech', 'experience', 'leadership', 'terrain', 'home', 'visitor'];
    armies.forEach(army => {
        winCounts[army.name] = 0;
        statSums[army.name] = {training: 0, weaponry: 0, morale: 0, tactics: 0, logistics: 0, tech: 0, experience: 0, leadership: 0, terrain: 0, home: 0, visitor: 0, count: 0};
        statWinSums[army.name] = {training: 0, weaponry: 0, morale: 0, tactics: 0, logistics: 0, tech: 0, experience: 0, leadership: 0, terrain: 0, home: 0, visitor: 0, count: 0};
    });
    simResults.forEach(sim => {
        sim.results.forEach((r, idx) => {
            let army = armies[idx % armies.length];
            statNames.forEach(stat => {
                statSums[army.name][stat] += army[stat];
            });
            statSums[army.name].count++;
        });
        sim.winners.forEach(w => {
            winCounts[w.name] = (winCounts[w.name] || 0) + 1;
            let winnerArmy = armies.find(a => a.name === w.name);
            if (winnerArmy) {
                statNames.forEach(stat => {
                    statWinSums[winnerArmy.name][stat] += winnerArmy[stat];
                });
                statWinSums[winnerArmy.name].count++;
            }
        });
    });
    let winSummary = Object.entries(winCounts).map(([name, count]) => `${name}: ${count} wins`).join('<br>');
    // Stat analysis: which stat had the biggest difference between winners and all armies?
    let statDiffs = {};
    statNames.forEach(stat => {
        let totalAvg = 0, winAvg = 0, totalN = 0, winN = 0;
        armies.forEach(a => {
            totalAvg += statSums[a.name][stat];
            totalN += statSums[a.name].count;
            winAvg += statWinSums[a.name][stat];
            winN += statWinSums[a.name].count;
        });
        totalAvg = totalN ? totalAvg / totalN : 0;
        winAvg = winN ? winAvg / winN : 0;
        statDiffs[stat] = winAvg - totalAvg;
    });
    let mostInfluential = Object.entries(statDiffs).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
    let statLabel = {
        training: 'Training',
        weaponry: 'Weaponry',
        morale: 'Morale',
        tactics: 'Tactics',
        logistics: 'Logistics',
        tech: 'Tech',
        experience: 'Experience',
        leadership: 'Leadership',
        terrain: 'Terrain Adaptation',
        home: 'Home Advantage',
        visitor: 'Visitor Disadvantage'
    };
    let statAnalysis = mostInfluential ? `<b>Most influential stat:</b> ${statLabel[mostInfluential[0]]} (${mostInfluential[1] > 0 ? '+' : ''}${mostInfluential[1].toFixed(2)} avg in winners)` : '';
    resultsDiv.innerHTML = `<div class="army-summary">${summary}</div><div><b>Results:</b><br>${winSummary}</div><div style="margin-top:12px;">${statAnalysis}</div>`;
}

function setupArmyConfigUI() {
    const armiesList = document.getElementById('armies-list');
    function addArmy(preset = null) {
        const div = createArmyConfig(armiesList.children.length, preset);
        armiesList.appendChild(div);
        // Preset select logic
        const presetSelect = div.querySelector('.preset-select');
        presetSelect.addEventListener('change', e => {
            if (presetSelect.value) {
                const presetArmy = ARMY_PRESETS[parseInt(presetSelect.value)];
                const newDiv = createArmyConfig(0, presetArmy);
                armiesList.replaceChild(newDiv, div);
                setupRemoveButton(newDiv);
                setupPresetSelect(newDiv);
            }
        });
        setupRemoveButton(div);
        setupPresetSelect(div);
    }
    function setupRemoveButton(div) {
        div.querySelector('.remove-army').onclick = () => {
            armiesList.removeChild(div);
        };
    }
    function setupPresetSelect(div) {
        // Already handled in addArmy
    }
    document.getElementById('add-army').onclick = () => addArmy();
    // Add two default armies
    addArmy(ARMY_PRESETS[0]);
    addArmy(ARMY_PRESETS[1]);
}

document.addEventListener('DOMContentLoaded', () => {
    setupArmyConfigUI();
    document.getElementById('battle-config').onsubmit = function(e) {
        e.preventDefault();
        const armies = getArmyConfigs();
        const numSim = parseInt(document.getElementById('num-simulations').value);
        let simResults = [];
        for (let i = 0; i < numSim; i++) {
            simResults.push(runSimulation(armies));
        }
        showResults(simResults, armies);
    };
});
