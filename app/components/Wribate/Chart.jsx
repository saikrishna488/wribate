import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function VotesChart({ data, title, wribate }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Define section colors
  const sectionColors = {
    opening: 'rgba(5, 150, 105, 0.1)',
    rebuttals: 'rgba(220, 38, 38, 0.1)', 
    closing: 'rgba(124, 58, 237, 0.1)',
    after: 'rgba(234, 88, 12, 0.1)'
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    
    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Prepare data
    const labels = data.map(d => `Round ${d.roundNumber}`);
    const forVotes = data.map(d => d.forVotes);
    const againstVotes = data.map(d => d.againstVotes);

    console.log(againstVotes)

    // Create background sections plugin
    const backgroundSections = {
      id: 'backgroundSections',
      beforeDraw: (chart) => {
        const { ctx, chartArea: { left, right, top, bottom }, scales: { x } } = chart;
        
        ctx.save();
        
        // Define sections (assuming 13 rounds total)
        const sections = [
          { start: 0, end: 4, color: sectionColors.opening, label: 'Opening' },
          { start: 4, end: 8, color: sectionColors.rebuttals, label: 'Rebuttals' }, 
          { start: 8, end: 12, color: sectionColors.closing, label: 'Closing' },
          { start: 12, end: 13, color: sectionColors.after, label: 'After' }
        ];

        sections.forEach(section => {
          const startX = x.getPixelForValue(section.start);
          const endX = x.getPixelForValue(section.end);
          
          ctx.fillStyle = section.color;
          ctx.fillRect(startX, top, endX - startX, bottom - top);
        });
        
        ctx.restore();
      }
    };

    chartInstance.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'For',
            data: forVotes,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#10B981',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.2,
            fill: false
          },
          {
            label: 'Against', 
            data: againstVotes,
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#EF4444',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          title: {
            display: false
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#374151',
              font: {
                size: 14,
                weight: 'bold'
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(31, 41, 55, 0.95)',
            titleColor: '#F9FAFB',
            bodyColor: '#F9FAFB',
            borderColor: '#6B7280',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: function(tooltipItems) {
                const roundNum = tooltipItems[0].dataIndex + 1;
                let section = '';
                if (roundNum <= 4) section = ' (Opening)';
                else if (roundNum <= 8) section = ' (Rebuttals)';
                else if (roundNum <= 12) section = ' (Closing)';
                else section = ' (After)';
                
                return `Round ${roundNum}${section}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Wribate Rounds',
              color: '#6B7280',
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 11
              },
              callback: function(value, index) {
                const roundNum = index + 1;
                if (roundNum === 2 || roundNum === 6 || roundNum === 10 || roundNum === 13) {
                  if (roundNum === 2) return 'Opening';
                  if (roundNum === 6) return 'Rebuttals';  
                  if (roundNum === 10) return 'Closing';
                  if (roundNum === 13) return 'After';
                }
                return '';
              }
            },
            grid: {
              color: 'rgba(107, 114, 128, 0.3)',
              drawBorder: true,
              borderColor: '#6B7280'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Votes',
              color: '#6B7280',
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 11
              }
            },
            grid: {
              color: 'rgba(107, 114, 128, 0.3)',
              drawBorder: true,
              borderColor: '#6B7280'
            }
          }
        }
      },
      plugins: [backgroundSections]
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="w-full bg-white shadow-2xl mb-4 rounded-lg flex flex-col justify-center items-center p-4 border border-gray-300">
      <h2 className="text-center text-lg font-bold mb-4 text-gray-900">
        {title}
      </h2>
      <div className="w-full h-96">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}